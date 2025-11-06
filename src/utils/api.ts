import { httpsCallable } from "firebase/functions";
import { functions } from "../firebase";

export const fetchBooks = async (query: string) => {
  const searchBooks = httpsCallable(functions, 'searchBooks');
  try {
    const result = await searchBooks({ query });
    const data = result.data as any;
    return data.items ? data.items.map((item: any) => ({
      id: item.id,
      title: item.volumeInfo.title,
      author: item.volumeInfo.authors ? item.volumeInfo.authors.join(', ') : 'Unknown Author',
      image: item.volumeInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/128x192.png?text=No+Image',
      rating: item.volumeInfo.averageRating || 0,
      trending: Math.floor(Math.random() * 100) + 1, // Mock trending data
      readers: Math.floor(Math.random() * 1000) + 100, // Mock readers data
    })) : [];
  } catch (error) {
    console.error("Error fetching books:", error);
    return [];
  }
};
