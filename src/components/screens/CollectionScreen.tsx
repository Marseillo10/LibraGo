import { useState, useRef, useEffect } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { BookOpen, Heart, Clock, Star, MoreVertical, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { useAuth } from "../../context/AuthContext";
import { collection, onSnapshot, addDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { Input } from "../ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog";

interface CollectionScreenProps {
  onSelectBook: (bookId: string) => void;
}

export function CollectionScreen({ onSelectBook }: CollectionScreenProps) {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState("all");
  const [collections, setCollections] = useState<any[]>([]);
  const [showCreateCollectionDialog, setShowCreateCollectionDialog] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");
  const tabsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentUser) {
      const unsubscribe = onSnapshot(collection(db, "users", currentUser.uid, "collections"), (snapshot) => {
        const collectionsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCollections(collectionsData);
      });
      return unsubscribe;
    }
  }, [currentUser]);

  const handleCreateCollection = async () => {
    if (currentUser && newCollectionName.trim() !== "") {
      await addDoc(collection(db, "users", currentUser.uid, "collections"), {
        name: newCollectionName,
        books: [],
      });
      setNewCollectionName("");
      setShowCreateCollectionDialog(false);
    }
  };

  const filteredBooks = collections.reduce((acc, collection) => {
    if (activeTab === "all" || activeTab === collection.id) {
      return [...acc, ...collection.books];
    }
    return acc;
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pb-20 lg:pb-8">
      {/* Sticky Header */}
      <div className="sticky top-0 z-30 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="px-6 py-6 lg:px-12">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-gray-900 dark:text-white mb-2">
              Koleksi Saya
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {collections.length} koleksi ditemukan
            </p>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 lg:px-12">
        <div className="max-w-6xl mx-auto">
          {/* Sticky Tabs - Swipeable with Labels */}
          <div className="sticky top-[120px] lg:top-[104px] z-20 bg-white dark:bg-gray-900 pb-4 -mx-6 px-6 lg:-mx-12 lg:px-12 mb-2">
            <div ref={tabsContainerRef} className="max-w-6xl mx-auto overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing touch-pan-x">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="inline-flex w-auto gap-1 h-auto py-1">
                  <TabsTrigger value="all" className="flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-1.5 min-w-[70px] sm:min-w-0 h-auto">
                    <BookOpen className="w-4 h-4 flex-shrink-0" />
                    <span className="text-[10px] sm:text-sm leading-tight">Semua</span>
                  </TabsTrigger>
                  {collections.map(col => (
                    <TabsTrigger key={col.id} value={col.id} className="flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-1.5 min-w-[70px] sm:min-w-0 h-auto">
                      <Heart className="w-4 h-4 flex-shrink-0" />
                      <span className="text-[10px] sm:text-sm leading-tight">{col.name}</span>
                    </TabsTrigger>
                  ))}
                  <Button variant="ghost" size="icon" onClick={() => setShowCreateCollectionDialog(true)}>
                    <Plus className="w-5 h-5" />
                  </Button>
                </TabsList>
              </Tabs>
            </div>
          </div>

          {/* Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsContent value={activeTab} className="mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {/* Book rendering logic will be added here */}
              </div>

              {filteredBooks.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-gray-900 dark:text-white mb-2">
                    Belum ada buku
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Mulai tambahkan buku ke koleksi Anda
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Dialog open={showCreateCollectionDialog} onOpenChange={setShowCreateCollectionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Buat Koleksi Baru</DialogTitle>
          </DialogHeader>
          <Input value={newCollectionName} onChange={(e) => setNewCollectionName(e.target.value)} placeholder="Nama Koleksi" />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateCollectionDialog(false)}>Batal</Button>
            <Button onClick={handleCreateCollection}>Buat</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
