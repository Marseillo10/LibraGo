
import React from 'react';
import { LibraGoLogo } from '../LibraGoLogo';

export function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col items-center justify-center p-6">
      <div className="text-center">
        <LibraGoLogo size="lg" showText={true} />
        <div className="mt-8 flex items-center justify-center space-x-2">
          <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce"></div>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-lg mt-4">Mempersiapkan rekomendasi untuk Anda...</p>
      </div>
    </div>
  );
}
