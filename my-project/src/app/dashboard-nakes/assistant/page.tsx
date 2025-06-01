// src/app/dashboard-nakes/assistant/page.tsx (disesuaikan dengan lokasi Anda)
'use client'; // Diperlukan jika ada interaktivitas atau hook React

import Chatbox from '@/components/chatbox'; // PASTIKAN PATH INI BENAR ke komponen Chatbox Anda
import Link from 'next/link';
import { ChevronLeft, MessageSquareText, User, Bot } from 'lucide-react'; // Menggunakan ikon dari lucide-react/ Menggunakan ikon dari lucide-react

export default function AssistantPage() {
  const doctorName = "Dr. Zulfahmi";

  return (
    // Pastikan ini adalah div tunggal sebagai root halaman Anda
    <div className="flex flex-col h-screen bg-slate-100 overflow-hidden">
      {/* Header Halaman Asisten */}
      <header className="bg-slate-800 text-white shadow-md sticky top-0 z-50 flex-shrink-0">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              {/* === Perubahan di sini: Menggunakan Link TANPA legacyBehavior === */}
              {/* Ini adalah cara yang direkomendasikan di Next.js App Router */}
              <Link href="/dashboard-nakes" className="flex items-center text-xl font-bold hover:text-sky-400 transition-colors">
                <ChevronLeft className="mr-2 h-6 w-6" />
                Kembali ke Dashboard
              </Link>
            </div>
            <div className="flex items-center space-x-2">
              <MessageSquareText className="h-6 w-6 text-sky-400" />
              <h1 className="text-xl font-semibold">Asisten AI Nakes</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Kontainer Utama untuk Chatbox */}
      <main className="flex-grow container mx-auto p-0 sm:p-2 md:p-4 lg:p-6 flex flex-col items-center min-h-0 overflow-hidden w-full">
        <div className="w-full max-w-3xl bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col h-full">
          {/* Komponen Chatbox akan mengisi sisa ruang di dalam wrapper ini */}
          <div className="flex-grow min-h-0">
            <Chatbox />
          </div>
        </div>
      </main>

      {/* Footer Halaman Asisten (opsional) */}
      <footer className="py-4 text-center text-xs text-slate-500 bg-slate-200 flex-shrink-0">
        &copy; {new Date().getFullYear()} SIAGA 3T+ | Asisten AI
      </footer>
    </div>
  );
}