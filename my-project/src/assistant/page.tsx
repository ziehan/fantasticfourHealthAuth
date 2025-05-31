// src/app/assistant/page.tsx (Halaman Asisten AI)
import Chatbox from '@/components/chatbox'; // Sesuaikan path jika berbeda
import Link from 'next/link';
import { ChevronLeft, MessageSquareText, Info } from 'lucide-react'; // Contoh ikon

export default function AssistantPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-100">
      <header className="bg-slate-800 text-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/" legacyBehavior>
                <a className="flex items-center text-xl font-bold hover:text-sky-400 transition-colors">
                  <ChevronLeft className="mr-2 h-6 w-6" />
                  SIAGA 3T+
                </a>
              </Link>
            </div>
            <div className="flex items-center space-x-2">
               <MessageSquareText className="h-6 w-6 text-sky-400" />
              <h1 className="text-xl font-semibold">Asisten AI Anda</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8 flex flex-col items-center">
        <div className="w-full max-w-3xl bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col" style={{minHeight: 'calc(100vh - 12rem)'}}>
          <div className="p-4 sm:p-6 border-b border-slate-200 bg-slate-50 rounded-t-xl">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <Info className="h-8 w-8 text-sky-500" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-800">Selamat Datang!</h2>
                <p className="text-sm text-slate-600 mt-1">
                  Saya adalah asisten AI yang siap membantu menjawab pertanyaan Anda terkait SOP dan pedoman kesehatan.
                  Silakan ketik pertanyaan Anda di bawah.
                </p>
              </div>
            </div>
          </div>
          
          {/* Komponen Chatbox akan mengisi sisa ruang */}
          <div className="flex-grow flex flex-col p-1 sm:p-2 md:p-4">
            <Chatbox /> 
          </div>
        </div>
      </main>

      <footer className="py-6 text-center text-sm text-slate-600 bg-slate-200">
        &copy; {new Date().getFullYear()} SIAGA 3T+ | Asisten AI
      </footer>
    </div>
  );
}