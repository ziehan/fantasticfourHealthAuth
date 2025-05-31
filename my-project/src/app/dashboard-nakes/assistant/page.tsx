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
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}