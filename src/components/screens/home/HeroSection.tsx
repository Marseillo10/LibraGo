import { Crown, Bell, Sparkles } from "lucide-react";
import { Button } from "../../ui/button";
import { Card } from "../../ui/card";

interface HeroSectionProps {
  onUpgrade: () => void;
  userName: string;
}

export function HeroSection({ onUpgrade, userName }: HeroSectionProps) {
  return (
    <div className="relative text-white px-6 pt-8 pb-12 lg:px-12 lg:pt-12 overflow-hidden">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1544132998-ae26c2655274?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaWJyYXJ5JTIwYm9va3MlMjBzaGVsdmVzfGVufDF8fHx8MTc2MTczODQyNnww&ixlib=rb-4.1.0&q=80&w=1080')`
        }}
      >
        {/* Dark overlay untuk readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-blue-800/85 to-purple-900/90"></div>
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600 rounded-full blur-3xl" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-blue-100 mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Selamat Malam
            </p>
            <h1 className="flex items-center gap-2 text-white drop-shadow-lg">
              {userName}! 👋
            </h1>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20 backdrop-blur-sm"
          >
            <Bell className="w-5 h-5" />
          </Button>
        </div>

        {/* Premium Banner */}
        <Card className="bg-gradient-to-r from-yellow-400 via-orange-400 to-orange-500 border-0 p-6 shadow-2xl backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-start gap-4">
              <div className="bg-white/20 p-3 rounded-lg">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div className="text-white">
                <h3 className="mb-1">
                  Akses Tanpa Batas ke 10,000+ Buku & Jurnal
                </h3>
                <p className="text-white/90 text-sm">
                  Upgrade ke Premium dan nikmati semua fitur eksklusif!
                </p>
              </div>
            </div>
            <Button
              onClick={onUpgrade}
              className="bg-white text-orange-600 hover:bg-white/90 shrink-0"
            >
              Upgrade
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
