
import { useState, useEffect } from "react";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";
import { Outlet, useNavigate } from "react-router-dom";
import { BottomNav } from "./components/BottomNav";
import { MobileMenu } from "./components/MobileMenu";
import { DesktopSidebar } from "./components/DesktopSidebar";
import { CommandPalette } from "./components/CommandPalette";
import { Moon, Sun, WifiOff } from "lucide-react";
import { Button } from "./components/ui/button";
import { useKeyboardShortcuts, useOnlineStatus } from "./utils/hooks";
import { useAuth } from "./context/AuthContext";
import { useTheme } from "./context/ThemeContext";
import { db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import { LoadingScreen } from "./components/screens/LoadingScreen";

export default function App() {
  const { currentUser, loading } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationCount] = useState(3); // Mock notification count
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  const userData = {
    name: currentUser?.displayName || "User",
    email: currentUser?.email || "",
    isPremium: false,
  };

  const recentBooks = [
    { id: "1", title: "Atomic Habits" },
    { id: "2", title: "Clean Code" },
    { id: "3", title: "The Pragmatic Programmer" },
  ];

  // Online status hook
  const isOnline = useOnlineStatus();

  // Handle window resize for responsive design
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Effect to handle screen changes based on auth state
  useEffect(() => {
    if (!loading) {
      const checkOnboarding = async () => {
        if (currentUser) {
          const userDocRef = doc(db, "users", currentUser.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists() && !userDoc.data().hasCompletedOnboarding) {
            navigate("/welcome");
          } else {
            navigate("/home");
          }
        } else {
          navigate("/login");
        }
      };
      checkOnboarding();
    }
  }, [currentUser, loading, navigate]);


  // Keyboard Shortcuts (enabled when logged in)
  useKeyboardShortcuts(
    currentUser
      ? [
          {
            key: "k",
            meta: true,
            action: () => setCommandPaletteOpen(true),
            description: "Open command palette",
          },
          {
            key: "b",
            meta: true,
            action: () => {
              toast.info("Bookmark feature coming soon!");
            },
            description: "Toggle bookmark",
          },
          {
            key: "d",
            meta: true,
            action: () => {
              toggleDarkMode();
            },
            description: "Toggle dark mode",
          },
          {
            key: "/",
            action: () => {
              navigate("/search");
            },
            description: "Go to search",
          },
        ]
      : []
  );

  const handleLogout = async () => {
    try {
      await logout();
      toast.info("Anda telah keluar dari LibraGO");
      navigate("/login");
    } catch (error: any) {
      toast.error("Gagal keluar: " + error.message);
    }
  };

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  if (loading) {
    return <LoadingScreen />;
  }

  // Main app screens
  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Desktop Sidebar - Only show on desktop for main screens */}
      {isDesktop && currentUser && (
        <DesktopSidebar
          active={"home"}
          onNavigate={handleNavigate}
          onUpgrade={() => navigate("/subscription")}
          onLogout={handleLogout}
          userName={userData.name}
          userEmail={userData.email}
          isPremium={userData.isPremium}
        />
      )}

      {/* Main Content */}
      <div className={`${isDesktop && currentUser ? "lg:pl-64" : ""}`}>
        {/* Dark Mode Toggle - Desktop Only, Top Right */}
        {isDesktop && !location.pathname.includes("/read") && (
          <div className="fixed top-6 right-6 z-50">
            <Button
              variant="outline"
              size="icon"
              onClick={toggleDarkMode}
              className="rounded-full shadow-lg"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
          </div>
        )}

        {/* Screen Content */}
        <div className={`${!isDesktop ? "max-w-md mx-auto" : ""}`}>
          <Outlet />
        </div>

        {/* Mobile Menu - Available on all screens when mobile */}
        {!isDesktop && currentUser && (
          <MobileMenu
            userName={userData.name}
            userEmail={userData.email}
            isPremium={userData.isPremium}
            open={mobileMenuOpen}
            onOpenChange={setMobileMenuOpen}
            onNavigate={handleNavigate}
            onUpgrade={() => navigate("/subscription")}
            onLogout={handleLogout}
          />
        )}

        {/* Bottom Navigation - Only show on mobile for main screens */}
        {!isDesktop && currentUser && (
          <BottomNav 
            active={"home"} 
            onNavigate={handleNavigate}
            onMenuOpen={() => setMobileMenuOpen(true)}
            notificationCount={notificationCount}
          />
        )}
      </div>

      {/* Command Palette - Desktop only */}
      {isDesktop && currentUser && (
        <CommandPalette
          open={commandPaletteOpen}
          onOpenChange={setCommandPaletteOpen}
          onNavigate={handleNavigate}
          onToggleDarkMode={toggleDarkMode}
          darkMode={darkMode}
          currentScreen={"home"}
          recentBooks={recentBooks}
        />
      )}

      {/* Online Status Indicator - Mobile only */}
      {!isDesktop && !isOnline && (
        <div className="fixed top-0 left-0 right-0 bg-red-500 text-white text-center py-2 text-sm z-50 flex items-center justify-center gap-2">
          <WifiOff className="w-4 h-4" />
          <span>Tidak ada koneksi internet</span>
        </div>
      )}

      <Toaster position="top-center" richColors />
    </div>
  );
}

