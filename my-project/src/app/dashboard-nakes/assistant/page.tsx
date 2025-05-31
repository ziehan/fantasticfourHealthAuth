// src/app/assistant/page.tsx (atau path yang sesuai, misal app/assistant/page.tsx)
'use client'; // Diperlukan jika ada interaktivitas atau hook React

import Chatbox from '@/components/chatbox'; // PASTIKAN PATH INI BENAR ke komponen Chatbox Anda
import Link from 'next/link';
import { ChevronLeft, MessageSquareText, User, Bot } from 'lucide-react'; // Info diganti User & Bot dari lucide

export default function AssistantPage() {
  // Data dummy ini bisa diambil dari state global, context, atau props jika diperlukan
  const doctorName = "Dr. Zulfahmi"; // Ganti dengan cara Anda mendapatkan nama dokter

  return (
    <div className="flex flex-col h-screen bg-slate-100 overflow-hidden"> {/* h-screen dan overflow-hidden untuk layout halaman penuh */}
      
      {/* Header Halaman Asisten */}
      <header className="bg-slate-800 text-white shadow-md sticky top-0 z-50 flex-shrink-0">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/dashboard-nakes" legacyBehavior> {/* Link kembali ke Dashboard */}
                <a className="flex items-center text-xl font-bold hover:text-sky-400 transition-colors">
                  <ChevronLeft className="mr-2 h-6 w-6" />
                  Kembali ke Dashboard
                </a>
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
      {/* KUNCI: flex-grow agar mengisi sisa ruang, min-h-0, overflow-hidden */}
      <main className="flex-grow container mx-auto p-0 sm:p-2 md:p-4 lg:p-6 flex flex-col items-center min-h-0 overflow-hidden w-full">
        {/* Wrapper dengan batasan lebar dan tinggi untuk Chatbox, serta styling */}
        <div className="w-full max-w-3xl bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col h-full">
          {/* Header INTERNAL Chatbox (bagian "Selamat Datang") sekarang ada di Chatbox.tsx */}
          {/* Jika Anda memutuskan header ini ada di pageasisstant.tsx, pindahkan dari Chatbox.tsx ke sini */}
          
          {/* Komponen Chatbox akan mengisi sisa ruang di dalam wrapper ini */}
          {/* KUNCI: 'flex-grow' agar Chatbox mengisi sisa ruang div ini, 'min-h-0' */}
          <div className="flex-grow min-h-0"> {/* Div ini penting untuk membuat Chatbox (h-full) bekerja */}
            <Chatbox />
          </div>
        </div>
      </main>

      {/* Footer Halaman Asisten (opsional, bisa disederhanakan atau dihilangkan) */}
      <footer className="py-4 text-center text-xs text-slate-500 bg-slate-200 flex-shrink-0">
        &copy; {new Date().getFullYear()} SIAGA 3T+ | Asisten AI
      </footer>
    </div>
  );
}