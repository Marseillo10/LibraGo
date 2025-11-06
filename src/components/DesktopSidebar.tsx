import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import { LibraGoLogo } from "./LibraGoLogo";
import { Separator } from "./ui/separator";
import {
  Home,
  Search,
  BookOpen,
  User,
  Crown,
  LogOut,
  Bell,
  Clock,
  Target,
  Settings,
  HelpCircle,
  Download,
  Heart,
  Users,
} from "lucide-react";

interface DesktopSidebarProps {
  active: string;
  onNavigate: (page: string) => void;
  onUpgrade: () => void;
  onLogout: () => void;
  userName: string;
  userEmail: string;
  isPremium: boolean;
}

export function DesktopSidebar({
  active,
  onNavigate,
  onUpgrade,
  onLogout,
  userName,
  userEmail,
  isPremium,
}: DesktopSidebarProps) {
  const mainNavItems = [
    { id: "home", icon: Home, label: "Beranda" },
    { id: "search", icon: Search, label: "Pencarian" },
    { id: "collection", icon: BookOpen, label: "Koleksi Saya" },
    { id: "profile", icon: User, label: "Profil" },
  ];

  const featureNavItems = [
    { id: "notifications", icon: Bell, label: "Notifikasi", badge: 3 },
    { id: "history", icon: Clock, label: "Riwayat & Statistik" },
    { id: "goals", icon: Target, label: "Target & Tantangan" },
    { id: "downloads", icon: Download, label: "Download" },
    { id: "community", icon: Users, label: "Komunitas" },
  ];

  const systemNavItems = [
    { id: "settings", icon: Settings, label: "Pengaturan" },
    { id: "help", icon: HelpCircle, label: "Bantuan" },
    { id: "support", icon: Heart, label: "Dukung Kami" },
  ];

  return (
    <div className="fixed left-0 top-0 bottom-0 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-800">
        <LibraGoLogo size="sm" showText={true} />
      </div>

      {/* Navigation */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {/* Main Navigation */}
        <div className="space-y-1">
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        <Separator />

        {/* Feature Navigation */}
        <div className="space-y-1">
          <p className="px-4 text-xs text-gray-500 dark:text-gray-500 mb-2">
            FITUR
          </p>
          {featureNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors relative ${
                  isActive
                    ? "bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="flex-1 text-left">{item.label}</span>
                {item.badge && item.badge > 0 && (
                  <Badge className="bg-blue-600 text-white text-xs px-1.5 py-0 min-w-[20px] h-5">
                    {item.badge}
                  </Badge>
                )}
              </button>
            );
          })}
        </div>

        <Separator />

        {/* System Navigation */}
        <div className="space-y-1">
          {systemNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Premium Card */}
      {!isPremium && (
        <div className="p-4">
          <Card className="bg-gradient-to-br from-yellow-400 via-orange-400 to-orange-500 text-white p-4 border-0">
            <div className="flex items-start gap-3 mb-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <Crown className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm mb-1">Upgrade Premium</h3>
                <p className="text-xs text-white/90">Akses tanpa batas</p>
              </div>
            </div>
            <Button
              onClick={onUpgrade}
              className="w-full bg-white text-orange-600 hover:bg-white/90"
              size="sm"
            >
              Upgrade Sekarang
            </Button>
          </Card>
        </div>
      )}

      {/* User Profile */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-3 mb-3">
          <Avatar>
            <AvatarFallback className="bg-blue-600 text-white">
              {userName.split(" ").map(n => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-sm text-gray-900 dark:text-white truncate">
                {userName}
              </p>
              {isPremium && (
                <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 text-xs px-1.5 py-0">
                  <Crown className="w-2.5 h-2.5" />
                </Badge>
              )}
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
              {userEmail}
            </p>
          </div>
        </div>
        <Button
          onClick={onLogout}
          variant="outline"
          className="w-full text-red-600 border-red-600 hover:bg-red-50 dark:hover:bg-red-950"
          size="sm"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Keluar
        </Button>
      </div>
    </div>
  );
}
