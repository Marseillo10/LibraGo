import React from 'react';
import { ChevronRight, Star } from "lucide-react";
import { Card } from "../../ui/card";
import { Button } from "../../ui/button";
import { ImageWithFallback } from "../../figma/ImageWithFallback";
import { SwipeableBookCard } from "../../SwipeableBookCard";
import { toast } from "sonner";

interface Recommendation {
  id: string;
  title: string;
  author: string;
  image: string;
  rating: number;
}

interface RecommendationsSectionProps {
  recommendations: Recommendation[];
  onSelectBook: (bookId: string) => void;
}

export function RecommendationsSection({
  recommendations,
  onSelectBook,
}: RecommendationsSectionProps) {
  return (
    <div className="bg-white dark:bg-gray-800 px-6 py-8 lg:px-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-gray-900 dark:text-white">
            Rekomendasi Untuk Anda
          </h2>
          <Button
            variant="ghost"
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            Lihat Semua
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map((book) => {
            const bookCover = (
              <div className="aspect-[3/4] overflow-hidden">
                <ImageWithFallback
                  src={book.image}
                  alt={book.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            );

            const bookContent = (
              <div className="p-4">
                <h3 className="text-gray-900 dark:text-white mb-2 line-clamp-2">
                  {book.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-1">
                  {book.author}
                </p>
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-sm text-gray-900 dark:text-white">
                    {book.rating}
                  </span>
                </div>
              </div>
            );

            return (
              <React.Fragment key={book.id}>
                {/* Mobile with swipe */}
                <div className="lg:hidden">
                  <SwipeableBookCard
                    bookId={book.id}
                    cover={bookCover}
                    content={bookContent}
                    onBookClick={() => onSelectBook(book.id)}
                    onBookmark={() => toast.success(`${book.title} ditambahkan ke bookmark`)}
                    onDownload={() => toast.success(`Mengunduh ${book.title}...`)}
                    onInfo={() => onSelectBook(book.id)}
                    onAddToCollection={() => toast.success(`${book.title} ditambahkan ke koleksi`)}
                  />
                </div>

                {/* Desktop without swipe */}
                <Card
                  className="hidden lg:block overflow-hidden cursor-pointer hover:shadow-lg transition-shadow bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                  onClick={() => onSelectBook(book.id)}
                >
                  {bookCover}
                  {bookContent}
                </Card>
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}
