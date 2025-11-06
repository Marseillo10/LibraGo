import { useState, useEffect } from "react";
import { PullToRefresh } from "../PullToRefresh";
import { DashboardStats } from "../DashboardStats";
import { toast } from "sonner";
import { HeroSection } from "./home/HeroSection";
import { ContinueReadingSection } from "./home/ContinueReadingSection";
import { TrendingBooksSection } from "./home/TrendingBooksSection";
import { RecommendationsSection } from "./home/RecommendationsSection";
import { SwipeTutorial } from "../SwipeableBookCard";
import { useAuth } from "../../context/AuthContext";
import { fetchBooks } from "../../utils/api";

interface HomeScreenProps {
  onSelectBook: (bookId: string) => void;
  onUpgrade: () => void;
}

export function HomeScreen({ onSelectBook, onUpgrade }: HomeScreenProps) {
  const { currentUser } = useAuth();
  const [showSwipeTutorial, setShowSwipeTutorial] = useState(false);
  const [showSwipeHint, setShowSwipeHint] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [trendingBooks, setTrendingBooks] = useState<any[]>([]);

  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem('hasSeenSwipeTutorial');
    if (!hasSeenTutorial) {
      const timer = setTimeout(() => {
        setShowSwipeTutorial(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    const loadBooks = async () => {
      const recommended = await fetchBooks('react');
      const trending = await fetchBooks('typescript');
      setRecommendations(recommended);
      setTrendingBooks(trending);
    };
    loadBooks();
  }, []);

  const handleDismissTutorial = () => {
    setShowSwipeTutorial(false);
    localStorage.setItem('hasSeenSwipeTutorial', 'true');
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    const recommended = await fetchBooks('react');
    const trending = await fetchBooks('typescript');
    setRecommendations(recommended);
    setTrendingBooks(trending);
    toast.success('Beranda diperbarui!');
    setIsRefreshing(false);
  };

  const continueReading = {
    id: "1",
    title: "Structure and Interpretation of Computer Programs",
    authors: "Harold Abelson, Gerald Jay Sussman",
    image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=400&h=300&fit=crop",
    progress: 67,
    currentPage: 234,
    totalPages: 350,
  };

  return (
    <PullToRefresh onRefresh={handleRefresh} className="min-h-screen">
      <div className="pb-20 lg:pb-8">
        <HeroSection onUpgrade={onUpgrade} userName={currentUser?.displayName || "User"} />
        <ContinueReadingSection continueReading={continueReading} onSelectBook={onSelectBook} />
        <div className="bg-white dark:bg-gray-800 px-6 py-8 lg:px-12">
          <div className="max-w-6xl mx-auto">
            <div className="mb-6">
              <h2 className="text-gray-900 dark:text-white mb-2">
                Statistik Membaca Anda
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Pantau progress dan pencapaian Anda
              </p>
            </div>
            <DashboardStats
              booksRead={25}
              readingStreak={14}
              monthlyGoal={10}
              monthlyProgress={7}
              totalPages={5420}
              achievements={12}
            />
          </div>
        </div>
        <TrendingBooksSection
          trendingBooks={trendingBooks}
          onSelectBook={onSelectBook}
          showSwipeHint={showSwipeHint}
          setShowSwipeHint={setShowSwipeHint}
        />
        <RecommendationsSection
          recommendations={recommendations}
          onSelectBook={onSelectBook}
        />
        {showSwipeTutorial && <SwipeTutorial onDismiss={handleDismissTutorial} />}
      </div>
    </PullToRefresh>
  );
}
