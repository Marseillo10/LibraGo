import { ChevronRight, Flame, Info, Star, TrendingUp } from "lucide-react";
import { Card } from "../../ui/card";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { ImageWithFallback } from "../../figma/ImageWithFallback";
import { SwipeableBookCard } from "../../SwipeableBookCard";
import { toast } from "sonner";
import React from "react";

interface TrendingBook {
  id: string;
  title: string;
  author: string;
  image: string;
  rating: number;
  readers: number;
  trending: number;
}

interface TrendingBooksSectionProps {
  trendingBooks: TrendingBook[];
  onSelectBook: (bookId: string) => void;
  showSwipeHint: boolean;
  setShowSwipeHint: (show: boolean) => void;
}

export function TrendingBooksSection({
  trendingBooks,
  onSelectBook,
  showSwipeHint,
  setShowSwipeHint,
}: TrendingBooksSectionProps) {
  return (
    <div className="bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-gray-900 dark:to-gray-800 px-6 py-8 lg:px-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 p-2 rounded-lg">
              <Flame className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-gray-900 dark:text-white">
              Sedang Trending
            </h2>
          </div>
          <Button
            variant="ghost"
            className="text-orange-600 hover:text-orange-700 dark:text-orange-400"
          >
            Lihat Semua
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

        {/* Swipe Hint for Mobile */}
        {showSwipeHint && (
          <div className="lg:hidden mb-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-blue-900 dark:text-blue-100">
                <strong>Tips:</strong> Geser kartu buku ke kiri untuk aksi cepat (Bookmark, Download, Info)
              </p>
            </div>
            <button
              onClick={() => setShowSwipeHint(false)}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 text-xl leading-none"
            >
              ×
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingBooks.map((book) => {
            const bookCover = (
              <div className="aspect-[3/4] overflow-hidden relative group">
                <ImageWithFallback
                  src={book.image}
                  alt={book.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/* Trending Badge */}
                <div className="absolute top-2 left-2">
                  <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    #{book.trending}
                  </Badge>
                </div>
                {/* Readers Count */}
                <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-sm text-white text-xs px-2 py-1 rounded">
                  {book.readers} pembaca
                </div>
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
                <Card
                  className="hidden lg:block overflow-hidden cursor-pointer hover:shadow-xl transition-all hover:-translate-y-1 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
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
