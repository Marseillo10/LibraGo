import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Slider } from "../ui/slider";
import { initAntiPiracy } from "../../utils/antiPiracy";
import { toast } from "sonner";
import {
  ArrowLeft,
  Settings,
  BookmarkPlus,
  Type,
  Sun,
  Moon,
  Minus,
  Plus,
  CheckCircle,
  Volume2,
  Highlighter,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "../ui/sheet";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Textarea } from "../ui/textarea";

interface EnhancedReaderScreenProps {
  onBack: () => void;
  userName: string;
  userEmail: string;
  bookId: string;
}

export function EnhancedReaderScreen({ onBack, userName, userEmail, bookId }: EnhancedReaderScreenProps) {
  const { currentUser } = useAuth();
  const [fontSize, setFontSize] = useState(16);
  const [theme, setTheme] = useState("sepia");
  const [brightness, setBrightness] = useState(100);
  const [currentPage, setCurrentPage] = useState(234);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [highlights, setHighlights] = useState<any[]>([]);
  const [selection, setSelection] = useState<Range | null>(null);

  // Initialize anti-piracy protection
  useEffect(() => {
    const userSession = {
      userId: userEmail,
      userName,
      userEmail,
      deviceId: "",
      sessionId: "",
      timestamp: Date.now(),
      isPremium: false,
    };
    
    const cleanup = initAntiPiracy(userSession);
    
    toast.success("Content Protection Active", {
      description: "Reading session secured",
      duration: 2000,
    });
    
    return cleanup;
  }, [userName, userEmail]);

  const themes = {
    light: { bg: "bg-white", text: "text-gray-900" },
    dark: { bg: "bg-gray-900", text: "text-gray-100" },
    sepia: { bg: "bg-amber-50", text: "text-gray-900" },
  };

  const currentTheme = themes[theme as keyof typeof themes];

  const bookContent = `Chapter 1: Building Abstractions with Procedures...`;

  const handleFinishBook = async () => {
    if (currentUser) {
      await addDoc(collection(db, "users", currentUser.uid, "history"), {
        bookId: bookId,
        completedDate: serverTimestamp(),
        pagesRead: 350,
        readingTime: "N/A",
        rating: 0,
      });
      toast.success("Buku telah ditandai sebagai selesai!");
      onBack();
    }
  };

  const handleSpeak = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      const utterance = new SpeechSynthesisUtterance(bookContent);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  const handleHighlight = () => {
    if (selection) {
      const newHighlight = {
        text: selection.toString(),
        range: selection,
        note: "",
      };
      setHighlights([...highlights, newHighlight]);
    }
  };

  const handleMouseUp = () => {
    const currentSelection = window.getSelection();
    if (currentSelection && currentSelection.rangeCount > 0) {
      setSelection(currentSelection.getRangeAt(0));
    }
  };

  return (
    <div
      className={`min-h-screen ${currentTheme.bg} transition-colors`}
      style={{
        filter: `brightness(${brightness}%)`,
      }}
      onMouseUp={handleMouseUp}
    >
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Halaman {currentPage} dari 350</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Highlighter className="w-5 h-5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none">Highlight & Catatan</h4>
                    <p className="text-sm text-muted-foreground">
                      Pilih teks untuk membuat highlight atau catatan.
                    </p>
                  </div>
                  <Textarea placeholder="Tulis catatan..." />
                  <Button onClick={handleHighlight}>Simpan</Button>
                </div>
              </PopoverContent>
            </Popover>
            <Button variant="ghost" size="icon" onClick={handleSpeak}>
              <Volume2 className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <BookmarkPlus className="w-5 h-5" />
            </Button>
            
            {/* Reader Settings */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Settings className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Pengaturan Pembaca</SheetTitle>
                  <SheetDescription>
                    Sesuaikan ukuran font, tema, dan kecerahan untuk pengalaman membaca yang lebih nyaman
                  </SheetDescription>
                </SheetHeader>

                <div className="space-y-6 mt-6">
                  {/* Font Size */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <Label className="flex items-center gap-2">
                        <Type className="w-4 h-4" />
                        Ukuran Font
                      </Label>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {fontSize}px
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setFontSize(Math.max(12, fontSize - 2))}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <Slider
                        value={[fontSize]}
                        onValueChange={(value) => setFontSize(value[0])}
                        min={12}
                        max={24}
                        step={2}
                        className="flex-1"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setFontSize(Math.min(24, fontSize + 2))}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Theme */}
                  <div>
                    <Label className="mb-3 block">Tema</Label>
                    <RadioGroup value={theme} onValueChange={setTheme}>
                      <div className="flex items-center space-x-2 p-3 border rounded-lg">
                        <RadioGroupItem value="light" id="light" />
                        <Label htmlFor="light" className="flex items-center gap-2 cursor-pointer flex-1">
                          <Sun className="w-4 h-4" />
                          Terang
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-3 border rounded-lg">
                        <RadioGroupItem value="dark" id="dark" />
                        <Label htmlFor="dark" className="flex items-center gap-2 cursor-pointer flex-1">
                          <Moon className="w-4 h-4" />
                          Gelap
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-3 border rounded-lg">
                        <RadioGroupItem value="sepia" id="sepia" />
                        <Label htmlFor="sepia" className="flex items-center gap-2 cursor-pointer flex-1">
                          <div className="w-4 h-4 rounded-full bg-amber-100" />
                          Sepia
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Brightness */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <Label>Kecerahan</Label>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {brightness}%
                      </span>
                    </div>
                    <Slider
                      value={[brightness]}
                      onValueChange={(value) => setBrightness(value[0])}
                      min={50}
                      max={150}
                      step={10}
                    />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-gray-200 dark:bg-gray-700">
          <div
            className="h-full bg-blue-600 transition-all"
            style={{ width: `${(currentPage / 350) * 100}%` }}
          />
        </div>
      </div>

      {/* Content with Watermark */}
      <div className="relative px-6 py-12 lg:px-12 max-w-4xl mx-auto">
        {/* ... watermark div ... */}

        {/* Book Content */}
        <div
          className={`${currentTheme.text} relative z-10 leading-relaxed`}
          style={{ fontSize: `${fontSize}px` }}
        >
          <div className="whitespace-pre-line">{bookContent}</div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            Halaman Sebelumnya
          </Button>
          <span className={`${currentTheme.text} text-sm`}>
            {currentPage} / 350
          </span>
          <Button
            onClick={() => setCurrentPage(Math.min(350, currentPage + 1))}
            disabled={currentPage === 350}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Halaman Selanjutnya
          </Button>
        </div>
        {currentPage === 350 && (
          <div className="text-center mt-8">
            <Button onClick={handleFinishBook} className="bg-green-600 hover:bg-green-700 text-white">
              <CheckCircle className="w-5 h-5 mr-2" />
              Tandai sebagai Selesai
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
