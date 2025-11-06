
import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import { LoginScreen } from "../components/screens/LoginScreen";
import { RegisterScreen } from "../components/screens/RegisterScreen";
import { WelcomeScreen } from "../components/screens/WelcomeScreen";
import { GenreSelectionScreen } from "../components/screens/GenreSelectionScreen";
import { HomeScreen } from "../components/screens/HomeScreen";
import { SearchScreen } from "../components/screens/SearchScreen";
import { EnhancedSearchScreen } from "../components/screens/EnhancedSearchScreen";
import { CollectionScreen } from "../components/screens/CollectionScreen";
import { ProfileScreen } from "../components/screens/ProfileScreen";
import { BookDetailScreen } from "../components/screens/BookDetailScreen";
import { ReaderScreen } from "../components/screens/ReaderScreen";
import { EnhancedReaderScreen } from "../components/screens/EnhancedReaderScreen";
import { SubscriptionScreen } from "../components/screens/SubscriptionScreen";
import NotificationScreen from "../components/screens/NotificationScreen";
import HistoryScreen from "../components/screens/HistoryScreen";
import { ReadingGoalsScreen } from "../components/screens/ReadingGoalsScreen";
import SettingsScreen from "../components/screens/SettingsScreen";
import HelpScreen from "../components/screens/HelpScreen";
import DownloadScreen from "../components/screens/DownloadScreen";
import SupportScreen from "../components/screens/SupportScreen";
import { CommunityScreen } from "../components/screens/CommunityScreen";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "login", element: <LoginScreen /> },
      { path: "register", element: <RegisterScreen /> },
      { path: "welcome", element: <WelcomeScreen /> },
      { path: "genre-selection", element: <GenreSelectionScreen /> },
      { path: "home", element: <HomeScreen /> },
      { path: "search", element: <SearchScreen /> },
      { path: "search/enhanced", element: <EnhancedSearchScreen /> },
      { path: "collection", element: <CollectionScreen /> },
      { path: "profile", element: <ProfileScreen /> },
      { path: "book/:bookId", element: <BookDetailScreen /> },
      { path: "read/:bookId", element: <ReaderScreen /> },
      { path: "read/:bookId/enhanced", element: <EnhancedReaderScreen /> },
      { path: "subscription", element: <SubscriptionScreen /> },
      { path: "notifications", element: <NotificationScreen /> },
      { path: "history", element: <HistoryScreen /> },
      { path: "goals", element: <ReadingGoalsScreen /> },
      { path: "settings", element: <SettingsScreen /> },
      { path: "help", element: <HelpScreen /> },
      { path: "downloads", element: <DownloadScreen /> },
      { path: "support", element: <SupportScreen /> },
      { path: "community", element: <CommunityScreen /> },
    ],
  },
]);
