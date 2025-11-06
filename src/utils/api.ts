export const fetchBooks = async (query: string) => {
  const functionUrl = 'https://us-central1-librago-1010.cloudfunctions.net/searchBooks';
  try {
    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.items ? data.items.map((item: any) => ({
      id: item.id,
      title: item.volumeInfo.title,
      author: item.volumeInfo.authors ? item.volumeInfo.authors.join(', ') : 'Unknown Author',
      image: item.volumeInfo?.imageLinks?.medium || item.volumeInfo?.imageLinks?.large || item.volumeInfo?.imageLinks?.thumbnail || item.volumeInfo?.imageLinks?.smallThumbnail || 'https://via.placeholder.com/128x192.png?text=No+Image',
      rating: item.volumeInfo.averageRating || 0,
      trending: Math.floor(Math.random() * 100) + 1, // Mock trending data
      readers: Math.floor(Math.random() * 1000) + 100, // Mock readers data
    })) : [];
  } catch (error) {
    console.error("Error fetching books:", error);
    return [];
  }
};
