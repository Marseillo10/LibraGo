import { useState, useEffect } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  ArrowLeft,
  Star,
  BookOpen,
  Heart,
  Share2,
  Download,
  Clock,
  FileText,
  Plus,
} from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { toast } from "sonner";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../firebase";
import { doc, getDoc, updateDoc, arrayUnion, onSnapshot, collection, addDoc } from "firebase/firestore";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog";
import { Input } from "../ui/input";
import DOMPurify from 'dompurify';

interface BookDetailScreenProps {
  onBack: () => void;
  onRead: () => void;
  onUpgrade: () => void;
  bookId: string;
}

export function BookDetailScreen({ onBack, onRead, onUpgrade, bookId }: BookDetailScreenProps) {
  const { currentUser } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [book, setBook] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [collections, setCollections] = useState<any[]>([]);
  const [showAddToCollectionDialog, setShowAddToCollectionDialog] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");

  useEffect(() => {
    const fetchBookData = async () => {
      if (!bookId) {
        setError("Book ID is missing.");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const response = await fetch(`https://www.googleapis.com/books/v1/volumes/${bookId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch book data');
        }
        const data = await response.json();
        setBook(data);
      } catch (err: any) {
        setError(err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookData();
  }, [bookId]);

  useEffect(() => {
    if (currentUser) {
      const unsubscribe = onSnapshot(collection(db, "users", currentUser.uid, "collections"), (snapshot) => {
        const collectionsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCollections(collectionsData);
      });
      return unsubscribe;
    }
  }, [currentUser]);

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? "Dihapus dari favorit" : "Ditambahkan ke favorit");
  };

  const handleShare = () => {
    toast.success("Link buku berhasil disalin!");
  };

  const handleDownload = () => {
    if (book.saleInfo?.isEbook) {
      onUpgrade();
    } else {
      toast.success("Buku sedang diunduh...");
    }
  };

  const handleAddToCollection = async (collectionId: string) => {
    if (currentUser && book) {
      const collectionRef = doc(db, "users", currentUser.uid, "collections", collectionId);
      await updateDoc(collectionRef, {
        books: arrayUnion(book.id)
      });
      toast.success(`Buku ditambahkan ke koleksi`);
      setShowAddToCollectionDialog(false);
    }
  };

  const handleCreateAndAddToCollection = async () => {
    if (currentUser && book && newCollectionName.trim() !== "") {
      const newCollectionRef = await addDoc(collection(db, "users", currentUser.uid, "collections"), {
        name: newCollectionName,
        books: [book.id],
      });
      toast.success(`Buku ditambahkan ke koleksi baru: ${newCollectionName}`);
      setNewCollectionName("");
      setShowAddToCollectionDialog(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!book) {
    return <div>Book not found.</div>;
  }

  const volumeInfo = book.volumeInfo;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="px-6 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h2 className="text-gray-900 dark:text-white flex-1">Detail Buku</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleToggleFavorite}
            className={isFavorite ? "text-pink-500" : ""}
          >
            <Heart className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`} />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleShare}>
            <Share2 className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="px-6 py-8 lg:px-12 pb-32">
        <div className="max-w-6xl mx-auto">
          {/* Book Info */}
          <div className="grid lg:grid-cols-3 gap-8 mb-8">
            {/* Cover */}
            <div className="lg:col-span-1">
              <div className="aspect-[3/4] rounded-lg overflow-hidden shadow-lg mb-4">
                <ImageWithFallback
                  src={volumeInfo.imageLinks?.medium || volumeInfo.imageLinks?.large || volumeInfo.imageLinks?.thumbnail || volumeInfo.imageLinks?.smallThumbnail}
                  alt={volumeInfo.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={onRead}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <BookOpen className="w-5 h-5 mr-2" />
                  {volumeInfo.readingProgress > 0 ? "Lanjutkan Membaca" : "Mulai Membaca"}
                </Button>
                <Button
                  onClick={handleDownload}
                  variant="outline"
                  className="w-full"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download
                </Button>
                <Button
                  onClick={() => setShowAddToCollectionDialog(true)}
                  variant="outline"
                  className="w-full"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Tambah ke Koleksi
                </Button>
              </div>

              {/* Reading Progress */}
              {volumeInfo.readingProgress > 0 && (
                <Card className="p-4 mt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Progress Baca
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        Halaman {volumeInfo.currentPage} dari {volumeInfo.pageCount}
                      </span>
                      <span className="text-gray-900 dark:text-white">
                        {volumeInfo.readingProgress}%
                      </span>
                    </div>
                    <Progress value={volumeInfo.readingProgress} className="h-2" />
                  </div>
                </Card>
              )}
            </div>

            {/* Details */}
            <div className="lg:col-span-2">
              <h1 className="text-gray-900 dark:text-white mb-3">
                {volumeInfo.title}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {volumeInfo.authors?.join(", ")}
              </p>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star className="w-5 h-5 fill-current" />
                  <span className="text-gray-900 dark:text-white">
                    {volumeInfo.averageRating || "N/A"}
                  </span>
                </div>
                <span className="text-gray-600 dark:text-gray-400 text-sm">
                  ({volumeInfo.ratingsCount || 0} rating)
                </span>
              </div>

              {/* Genres */}
              <div className="flex flex-wrap gap-2 mb-6">
                {volumeInfo.categories?.map((genre: string) => (
                  <Badge key={genre} variant="secondary">
                    {genre}
                  </Badge>
                ))}
                {book.saleInfo?.isEbook && (
                  <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0">
                    Premium
                  </Badge>
                )}
              </div>

              {/* Tabs */}
              <Tabs defaultValue="description" className="w-full">
                <div className="overflow-x-auto scrollbar-hide -mx-6 px-6 lg:mx-0 lg:px-0">
                  <TabsList className="inline-flex w-auto min-w-full md:w-full">
                    <TabsTrigger value="description" className="flex-shrink-0">Deskripsi</TabsTrigger>
                    <TabsTrigger value="details" className="flex-shrink-0">Detail</TabsTrigger>
                    <TabsTrigger value="citation" className="flex-shrink-0">Sitasi</TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="description" className="mt-4">
                  <div
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(volumeInfo.description) }}
                    className="text-gray-700 dark:text-gray-300 leading-relaxed"
                  />
                </TabsContent>

                <TabsContent value="details" className="mt-4">
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-gray-600 dark:text-gray-400">Penulis</span>
                      <span className="text-gray-900 dark:text-white">{volumeInfo.authors?.join(", ")}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-gray-600 dark:text-gray-400">Penerbit</span>
                      <span className="text-gray-900 dark:text-white">{volumeInfo.publisher}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-gray-600 dark:text-gray-400">Tahun</span>
                      <span className="text-gray-900 dark:text-white">{volumeInfo.publishedDate}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-gray-600 dark:text-gray-400">Halaman</span>
                      <span className="text-gray-900 dark:text-white">{volumeInfo.pageCount}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-gray-600 dark:text-gray-400">Bahasa</span>
                      <span className="text-gray-900 dark:text-white">{volumeInfo.language}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-gray-600 dark:text-gray-400">ISBN</span>
                      <span className="text-gray-900 dark:text-white">{volumeInfo.industryIdentifiers?.map(i => i.identifier).join(", ")}</span>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="citation" className="mt-4">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-gray-900 dark:text-white mb-2">
                        APA Style
                      </h3>
                      <Card className="p-4 bg-gray-50 dark:bg-gray-800">
                        <p className="text-gray-700 dark:text-gray-300 text-sm font-mono">
                          {volumeInfo.authors?.join(", ")}. ({volumeInfo.publishedDate}). <i>{volumeInfo.title}</i>. {volumeInfo.publisher}.
                        </p>
                      </Card>
                    </div>

                    <div>
                      <h3 className="text-gray-900 dark:text-white mb-2">
                        MLA Style
                      </h3>
                      <Card className="p-4 bg-gray-50 dark:bg-gray-800">
                        <p className="text-gray-700 dark:text-gray-300 text-sm font-mono">
                          {volumeInfo.authors?.join(", ")}. <i>{volumeInfo.title}</i>. {volumeInfo.publisher}, {volumeInfo.publishedDate}.
                        </p>
                      </Card>
                    </div>

                    <div>
                      <h3 className="text-gray-900 dark:text-white mb-2">
                        Export ke
                      </h3>
                      <div className="flex gap-3">
                        <Button
                          variant="outline"
                          onClick={() => toast.success("Exported to Zotero")}
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          Zotero
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => toast.success("Exported to Mendeley")}
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          Mendeley
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
      <Dialog open={showAddToCollectionDialog} onOpenChange={setShowAddToCollectionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah ke Koleksi</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            {collections.map(col => (
              <Button key={col.id} variant="ghost" onClick={() => handleAddToCollection(col.id)}>{col.name}</Button>
            ))}
          </div>
          <div className="flex items-center space-x-2 pt-4">
            <Input value={newCollectionName} onChange={(e) => setNewCollectionName(e.target.value)} placeholder="Koleksi Baru" />
            <Button onClick={handleCreateAndAddToCollection}>Buat & Tambah</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
