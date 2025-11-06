import { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  fetchSignInMethodsForEmail,
  linkWithCredential,
  updatePassword,
  deleteUser,
} from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, setDoc, deleteDoc } from 'firebase/firestore';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  register: (name: string, email: string, password: string) => Promise<any>;
  login: (email: string, password: string) => Promise<any>;
  logout: () => Promise<any>;
  signInWithGoogle: () => Promise<any>;
  updatePassword: (password: string) => Promise<void>;
  deleteAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({ 
  currentUser: null,
  loading: true,
  register: () => Promise.resolve(),
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  signInWithGoogle: () => Promise.resolve(),
  updatePassword: () => Promise.resolve(),
  deleteAccount: () => Promise.resolve(),
});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const register = async (name: string, email: string, password: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName: name });
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      uid: userCredential.user.uid,
      displayName: name,
      email: email,
      createdAt: new Date(),
      hasCompletedOnboarding: false,
    });
    return userCredential;
  };

  const login = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () => {
    return signOut(auth);
  };

  const deleteAccount = async () => {
    if (currentUser) {
      await deleteDoc(doc(db, "users", currentUser.uid));
      await deleteUser(currentUser);
    }
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const email = result.user.email;
      if (email) {
        const methods = await fetchSignInMethodsForEmail(auth, email);
        if (methods.length > 0 && methods.indexOf(GoogleAuthProvider.PROVIDER_ID) === -1) {
          // Account exists with a different provider
          // Link the Google credential to the existing account
          if (auth.currentUser) {
            await linkWithCredential(auth.currentUser, GoogleAuthProvider.credentialFromResult(result)!);
          }
        } else {
          // New user or existing Google user
          await setDoc(doc(db, 'users', result.user.uid), {
            uid: result.user.uid,
            displayName: result.user.displayName,
            email: result.user.email,
            createdAt: new Date(),
          }, { merge: true });
        }
      }
      return result;
    } catch (error) {
      console.error("Error during Google sign-in:", error);
      throw error;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    loading,
    register,
    login,
    logout,
    signInWithGoogle,
    updatePassword: (password: string) => updatePassword(currentUser!, password),
    deleteAccount,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};