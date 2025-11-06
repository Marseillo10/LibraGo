export interface User {
  uid: string;
  displayName: string;
  email: string;
  createdAt: Date;
  isPremium: boolean;
}

export interface Book {
  id: string;
  title: string;
  authors: string[];
  description: string;
  coverImage: string;
  genres: string[];
  averageRating: number;
  ratingsCount: number;
  publisher: string;
  publishedDate: string;
  pageCount: number;
}

export interface Collection {
  id: string;
  name: string;
  ownerId: string;
  bookIds: string[];
}

export interface ReadingState {
  bookId: string;
  userId: string;
  progress: number; // as a percentage
  currentPage: number;
  totalPages: number;
  lastRead: Date;
}
