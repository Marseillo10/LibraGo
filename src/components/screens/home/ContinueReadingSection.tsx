
import { BookOpen } from "lucide-react";
import { Card } from "../../ui/card";
import { Button } from "../../ui/button";
import { Progress } from "../../ui/progress";
import { ImageWithFallback } from "../../figma/ImageWithFallback";
import { useNavigate } from "react-router-dom";

interface ContinueReadingData {
  id: string;
  title: string;
  authors: string;
  image: string;
  progress: number;
  currentPage: number;
  totalPages: number;
}

interface ContinueReadingSectionProps {
  continueReading: ContinueReadingData;
}

export function ContinueReadingSection({
  continueReading,
}: ContinueReadingSectionProps) {
  const navigate = useNavigate();

  const handleSelectBook = (bookId: string) => {
    navigate(`/book/${bookId}`);
  };

  return (
    <div className="bg-white dark:bg-gray-800 px-6 py-8 lg:px-12">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-gray-900 dark:text-white mb-6">
          Lanjutkan Membaca
        </h2>

        <Card className="overflow-hidden hover:shadow-lg transition-shadow bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <div className="p-6">
            <div className="flex gap-4">
              {/* Book Cover */}
              <div
                className="w-24 h-32 rounded-lg overflow-hidden shrink-0 cursor-pointer"
                onClick={() => handleSelectBook(continueReading.id)}
              >
                <ImageWithFallback
                  src={continueReading.image}
                  alt={continueReading.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Book Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1 min-w-0">
                    <h3
                      className="text-gray-900 dark:text-white mb-2 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-2"
                      onClick={() => handleSelectBook(continueReading.id)}
                    >
                      {continueReading.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-1">
                      {continueReading.authors}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0 text-pink-500 hover:text-pink-600 hover:bg-pink-50 dark:hover:bg-pink-950"
                  >
                    <BookOpen className="w-5 h-5" />
                  </Button>
                </div>

                {/* Progress */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      Halaman {continueReading.currentPage} dari {continueReading.totalPages}
                    </span>
                    <span className="text-gray-900 dark:text-white">
                      {continueReading.progress}%
                    </span>
                  </div>
                  <Progress value={continueReading.progress} className="h-2" />
                </div>

                {/* Continue Button */}
                <Button
                  onClick={() => handleSelectBook(continueReading.id)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Lanjutkan
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

