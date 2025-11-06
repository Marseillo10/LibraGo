import React, { useState, useEffect } from "react";
import { Clock, TrendingUp, BookOpen, Calendar, Award, Flame, Target, BarChart3, Filter } from "lucide-react";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { ScrollArea } from "../ui/scroll-area";
import { Progress } from "../ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../firebase";
import { collection, onSnapshot } from "firebase/firestore";

const HistoryScreen = () => {
  const { currentUser } = useAuth();
  const [timeRange, setTimeRange] = useState("month");
  const [readingHistory, setReadingHistory] = useState<any[]>([]);

  useEffect(() => {
    if (currentUser) {
      const unsubscribe = onSnapshot(collection(db, "users", currentUser.uid, "history"), (snapshot) => {
        const historyData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setReadingHistory(historyData);
      });
      return unsubscribe;
    }
  }, [currentUser]);

  // Reading statistics
  const stats = {
    totalBooks: readingHistory.length,
    totalPages: readingHistory.reduce((acc, book) => acc + book.pagesRead, 0),
    totalTime: "0 jam",
    currentStreak: 0,
    longestStreak: 0,
    avgPagesPerDay: 0,
    booksThisMonth: 0,
    booksThisYear: 0,
  };

  // Weekly reading data
  const weeklyData = [
    { day: "Sen", pages: 0 },
    { day: "Sel", pages: 0 },
    { day: "Rab", pages: 0 },
    { day: "Kam", pages: 0 },
    { day: "Jum", pages: 0 },
    { day: "Sab", pages: 0 },
    { day: "Min", pages: 0 },
  ];

  // Monthly reading trend
  const monthlyData = [
    { month: "Mei", books: 0 },
    { month: "Jun", books: 0 },
    { month: "Jul", books: 0 },
    { month: "Agu", books: 0 },
    { month: "Sep", books: 0 },
    { month: "Okt", books: 0 },
  ];

  // Genre distribution
  const genreData = [
    { name: "Programming", value: 0, color: "#3B82F6" },
    { name: "Design", value: 0, color: "#8B5CF6" },
    { name: "Business", value: 0, color: "#10B981" },
    { name: "Science", value: 0, color: "#F59E0B" },
  ];

  // Achievements
  const achievements = [
    { id: 1, title: "Bookworm", description: "Baca 10 buku", icon: "🐛", unlocked: true },
    { id: 2, title: "Speed Reader", description: "Selesaikan buku dalam 24 jam", icon: "⚡", unlocked: true },
    { id: 3, title: "Night Owl", description: "Baca di malam hari 7 hari berturut", icon: "🦉", unlocked: true },
    { id: 4, title: "Genre Explorer", description: "Baca 5 genre berbeda", icon: "🌍", unlocked: true },
    { id: 5, title: "Consistent", description: "Reading streak 30 hari", icon: "🔥", unlocked: false },
    { id: 6, title: "Century Club", description: "Baca 100 buku", icon: "💯", unlocked: false },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-xl">
              <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-gray-900 dark:text-white">Riwayat & Statistik</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Analisis kebiasaan membaca Anda
              </p>
            </div>
          </div>

          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Minggu Ini</SelectItem>
              <SelectItem value="month">Bulan Ini</SelectItem>
              <SelectItem value="year">Tahun Ini</SelectItem>
              <SelectItem value="all">Semua Waktu</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Key Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-5 h-5" />
              <p className="text-sm opacity-90">Total Buku</p>
            </div>
            <p className="text-3xl mb-1">{stats.totalBooks}</p>
            <p className="text-xs opacity-75">{stats.booksThisMonth} bulan ini</p>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5" />
              <p className="text-sm opacity-90">Total Halaman</p>
            </div>
            <p className="text-3xl mb-1">{stats.totalPages.toLocaleString()}</p>
            <p className="text-xs opacity-75">{stats.avgPagesPerDay} per hari</p>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-green-500 to-green-600 text-white">
            <div className="flex items-center gap-2 mb-2">
              <Flame className="w-5 h-5" />
              <p className="text-sm opacity-90">Streak</p>
            </div>
            <p className="text-3xl mb-1">{stats.currentStreak}</p>
            <p className="text-xs opacity-75">Terpanjang: {stats.longestStreak} hari</p>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-amber-500 to-amber-600 text-white">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5" />
              <p className="text-sm opacity-90">Waktu Baca</p>
            </div>
            <p className="text-3xl mb-1">{stats.totalTime.split(" ")[0]}</p>
            <p className="text-xs opacity-75">jam total</p>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <div className="overflow-x-auto scrollbar-hide -mx-6 px-6">
            <TabsList className="inline-flex w-auto min-w-full md:grid md:w-full md:grid-cols-3">
              <TabsTrigger value="overview" className="flex-shrink-0">Overview</TabsTrigger>
              <TabsTrigger value="history" className="flex-shrink-0">Riwayat</TabsTrigger>
              <TabsTrigger value="achievements" className="flex-shrink-0">Achievement</TabsTrigger>
            </TabsList>
          </div>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Weekly Reading Chart */}
              <Card className="p-6">
                <h3 className="text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  Halaman Dibaca Minggu Ini
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="pages" fill="#3B82F6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              {/* Monthly Trend */}
              <Card className="p-6">
                <h3 className="text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                  Tren Bulanan
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="books" stroke="#8B5CF6" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </div>

            {/* Genre Distribution */}
            <Card className="p-6">
              <h3 className="text-gray-900 dark:text-white mb-4">Distribusi Genre</h3>
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="w-full md:w-1/2">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={genreData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {genreData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="w-full md:w-1/2 space-y-4">
                  {genreData.map((genre) => (
                    <div key={genre.name}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: genre.color }}
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {genre.name}
                          </span>
                        </div>
                        <span className="text-sm text-gray-900 dark:text-white">
                          {genre.value} buku
                        </span>
                      </div>
                      <Progress
                        value={(genre.value / stats.totalBooks) * 100}
                        className="h-2"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history">
            <Card className="p-6">
              <h3 className="text-gray-900 dark:text-white mb-4">Buku yang Telah Selesai</h3>
              <ScrollArea className="h-[500px]">
                <div className="space-y-4">
                  {readingHistory.map((book) => (
                    <div
                      key={book.id}
                      className="flex gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      <div className={`w-16 h-24 bg-gray-500 rounded-lg flex-shrink-0`} />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-gray-900 dark:text-white mb-1">{book.bookTitle}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {book.author}
                        </p>
                        <div className="flex flex-wrap gap-2 text-xs text-gray-500 dark:text-gray-500">
                          <span className="flex items-center gap-1">
                            <BookOpen className="w-3 h-3" />
                            {book.pagesRead} halaman
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {book.readingTime}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(book.completedDate.seconds * 1000).toLocaleDateString("id-ID")}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {Array.from({ length: book.rating }).map((_, i) => (
                          <span key={i} className="text-yellow-500">★</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </Card>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {achievements.map((achievement) => (
                <Card
                  key={achievement.id}
                  className={`p-6 text-center transition-all ${
                    achievement.unlocked
                      ? "bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-800"
                      : "opacity-60 grayscale"
                  }`}
                >
                  <div className="text-5xl mb-3">{achievement.icon}</div>
                  <h4 className="text-gray-900 dark:text-white mb-2">
                    {achievement.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {achievement.description}
                  </p>
                  {achievement.unlocked ? (
                    <Badge className="bg-green-600">Unlocked</Badge>
                  ) : (
                    <Badge variant="outline">Locked</Badge>
                  )}
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default HistoryScreen;
