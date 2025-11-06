interface UserSession {
  userId: string;
  userName: string;
  userEmail: string;
  deviceId: string;
  sessionId: string;
  timestamp: number;
  isPremium: boolean;
}

export const initAntiPiracy = (session: UserSession) => {
  console.log("Anti-piracy protection initialized for user:", session.userName);

  const detectDevTools = () => {
    const widthThreshold = window.outerWidth - window.innerWidth > 160;
    const heightThreshold = window.outerHeight - window.innerHeight > 160;

    if (widthThreshold || heightThreshold) {
      console.warn("DevTools detected!");
      // In a real implementation, you would send a log to the backend here.
    }
  };

  const interval = setInterval(detectDevTools, 5000);

  // Cleanup function to be called on component unmount
  return () => {
    console.log("Cleaning up anti-piracy protection.");
    clearInterval(interval);
  };
};