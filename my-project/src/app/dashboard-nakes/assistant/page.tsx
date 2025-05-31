<<<<<<< Updated upstream
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
=======
// src/app/assistant/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import Chatbox from '@/components/chatbox';
// Pastikan path ini benar sesuai struktur folder Anda
import Footer from '../sections/footer'; // Contoh path jika sections ada di dashboard-nakes
import Navbar from '../sections/navbar'; // Contoh path jika sections ada di dashboard-nakes
import { Info } from 'lucide-react';

export default function AssistantPage() {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-slate-100">
      <Navbar />

      {/* Main content area */}
      {/* justify-center akan memusatkan kartu jika tingginya kurang dari ruang yang tersedia */}
      <main className="flex-grow flex flex-col items-center justify-center container mx-auto px-4 py-6 sm:py-8 md:py-10 m-30">
        <div 
          className={`w-full max-w-3xl bg-white rounded-2xl shadow-xl flex flex-col 
                      transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          // Mengganti minHeight dengan height untuk ukuran yang lebih tetap
          // Sesuaikan '13rem' atau '14rem' ini jika perlu setelah melihat hasilnya.
          // Ini adalah estimasi (Navbar ~5rem, Footer ~3rem, Main PY ~5rem = Total 13rem)
          style={{ height: 'calc(100vh - 14rem)' }} // Anda bisa coba antara 13rem hingga 15rem
        >
          {/* Header/Intro di dalam kartu */}
          <div className="p-4 sm:p-6 border-b border-slate-200 bg-slate-50 rounded-t-2xl">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 p-2 bg-sky-100 rounded-full shadow-sm">
                <Info className="h-7 w-7 text-sky-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">Asisten AI Kesehatan Anda</h2>
                <p className="text-sm text-slate-600 mt-1">
                  Saya siap membantu menjawab pertanyaan Anda terkait SOP dan pedoman kesehatan.
                  Silakan ketik pertanyaan Anda di bawah.
                </p>
              </div>
            </div>
          </div>
          
          {/* Kontainer untuk Chatbox, akan mengisi sisa tinggi kartu */}
          {/* Tambahkan overflow-hidden untuk memastikan Chatbox tidak "bocor" jika kalkulasinya sedikit meleset */}
          <div className="flex-grow flex flex-col p-1 sm:p-2 md:p-4 overflow-hidden">
            {/* Chatbox component di dalamnya diatur:
              - Parent div ini: flex-grow, flex-col, overflow-hidden
              - Chatbox root: h-full, flex, flex-col
              - Message list di Chatbox: flex-grow, overflow-y-auto 
            */}
            <Chatbox /> 
>>>>>>> Stashed changes
          </div>
        </div>
      </main>

<<<<<<< Updated upstream
      {/* Footer Halaman Asisten (opsional, bisa disederhanakan atau dihilangkan) */}
      <footer className="py-4 text-center text-xs text-slate-500 bg-slate-200 flex-shrink-0">
        &copy; {new Date().getFullYear()} SIAGA 3T+ | Asisten AI
      </footer>
=======
      <Footer />
>>>>>>> Stashed changes
    </div>
  );
}