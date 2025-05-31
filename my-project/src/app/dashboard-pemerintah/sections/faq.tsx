// components/qna.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { ChevronDownIcon, QuestionMarkCircleIcon, ChatBubbleLeftRightIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

// --- Definisi Interface & Data (Spesifik untuk Q&A Section) ---
interface QnaItemData {
  id: number;
  question: string;
  answer: string | React.ReactNode; // Jawaban bisa berupa string atau JSX
}

// Contoh Data Q&A
const qnaData: QnaItemData[] = [
  {
    id: 1,
    question: "Apa itu HealthAuth dan bagaimana cara kerjanya?",
    answer: "HealthAuth adalah platform kesehatan digital terpadu yang dirancang untuk mendukung kesejahteraan dan performa profesional medis. Kami menggunakan teknologi AI untuk analisis burnout, menyediakan survei kustom, dukungan diagnosis, dan modul kesiapsiagaan krisis. Platform kami bertujuan untuk meringankan beban kerja Anda sehingga Anda bisa fokus pada perawatan pasien."
  },
  {
    id: 2,
    question: "Bagaimana HealthAuth menjaga keamanan data saya?",
    answer: (
      <>
        Keamanan dan privasi data Anda adalah prioritas utama kami. HealthAuth menerapkan standar keamanan tertinggi, termasuk:
        <ul className="list-disc list-inside mt-2 space-y-1 text-gray-600">
          <li>Enkripsi data end-to-end.</li>
          <li>Kepatuhan terhadap regulasi privasi data kesehatan (misalnya, HIPAA jika berlaku di yurisdiksi Anda, atau standar setara).</li>
          <li>Audit keamanan rutin dan pemantauan berkelanjutan.</li>
          <li>Kontrol akses yang ketat untuk memastikan hanya pihak berwenang yang dapat mengakses informasi sensitif.</li>
        </ul>
      </>
    )
  },
  {
    id: 3,
    question: "Siapa saja yang dapat menggunakan platform HealthAuth?",
    answer: "Platform kami dirancang khusus untuk para profesional medis, termasuk dokter, perawat, tenaga kesehatan pendukung, serta institusi kesehatan seperti rumah sakit dan klinik. Kami juga menyediakan solusi untuk tim manajemen SDM di sektor kesehatan."
  },
  {
    id: 4,
    question: "Apakah ada biaya untuk menggunakan HealthAuth?",
    answer: "HealthAuth menawarkan berbagai paket langganan yang disesuaikan dengan kebutuhan individu maupun institusi. Kami juga menyediakan periode uji coba gratis untuk beberapa fitur unggulan kami. Silakan hubungi tim penjualan kami untuk informasi lebih lanjut mengenai struktur harga."
  },
  {
    id: 5,
    question: "Bagaimana cara memulai dengan HealthAuth?",
    answer: "Memulai dengan HealthAuth sangat mudah! Anda dapat mendaftar untuk akun baru melalui tombol 'Mulai Sekarang' di halaman utama kami. Setelah pendaftaran, Anda akan dipandu melalui proses onboarding untuk menyesuaikan platform dengan kebutuhan spesifik Anda. Tim dukungan kami juga siap membantu jika Anda memerlukan asistensi."
  },
];

// --- Definisi Interface untuk Komponen Bantuan ---
interface FadeInUpProps {
  children: React.ReactNode;
  delay?: string;
  duration?: string;
  className?: string;
  as?: React.ElementType;
}

interface FloatingParticlesProps {
  particleColor?: string;
  count?: number;
  className?: string;
}

// --- Implementasi Komponen Bantuan (FadeInUp & FloatingParticles) ---
const FadeInUp: React.FC<FadeInUpProps> = ({
  children,
  delay = '',
  duration = 'duration-1000',
  className = '',
  as: Component = 'div',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);
  return (
    <Component
      className={`transition-all ease-out ${duration} ${delay} ${className} ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
    >
      {children}
    </Component>
  );
};

const FloatingParticles: React.FC<FloatingParticlesProps> = ({
  particleColor = "bg-[#A0D0D5]/10",
  count = 15,
  className = '',
}) => (
  <div aria-hidden="true" className={`absolute inset-0 overflow-hidden -z-10 ${className}`}>
    {[...Array(count)].map((_, i) => (
      <div
        key={i}
        className={`absolute ${particleColor} rounded-full animate-float`}
        style={{
          width: `${Math.random() * 40 + 15}px`, // Ukuran partikel sedikit lebih kecil
          height: `${Math.random() * 40 + 15}px`,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 6}s`,
          animationDuration: `${Math.random() * 20 + 12}s`,
          opacity: Math.random() * 0.2 + 0.03, // Opacity lebih rendah
        }}
      />
    ))}
  </div>
);

// --- Komponen Q&A Item (Accordion) ---
interface QnaItemProps {
  item: QnaItemData;
  isOpen: boolean;
  onClick: () => void;
}

const QnaItem: React.FC<QnaItemProps> = ({ item, isOpen, onClick }) => {
  return (
    <FadeInUp className="border-b border-[#A0D0D5]/50 last:border-b-0">
      <h2>
        <button
          type="button"
          className="flex items-center justify-between w-full py-5 px-1 sm:px-2 text-left font-semibold text-[#1E47A0] hover:text-[#123A7A] focus:outline-none focus-visible:ring focus-visible:ring-[#1E47A0]/50 rounded-md"
          onClick={onClick}
          aria-expanded={isOpen}
          aria-controls={`faq-answer-${item.id}`}
        >
          <span className="text-md md:text-lg">{item.question}</span>
          <ChevronDownIcon
            className={`w-6 h-6 shrink-0 transform transition-transform duration-300 ease-in-out ${
              isOpen ? 'rotate-180' : 'rotate-0'
            }`}
          />
        </button>
      </h2>
      <div
        id={`faq-answer-${item.id}`}
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          isOpen ? 'max-h-[1000px] opacity-100 pb-5' : 'max-h-0 opacity-0' // Transisi max-height dan opacity
        }`}
      >
        <div className="px-1 sm:px-2 text-gray-700 leading-relaxed text-sm md:text-base">
          {item.answer}
        </div>
      </div>
    </FadeInUp>
  );
};


// --- Komponen Q&A Section Utama ---
const Qna: React.FC = () => {
  const [openAccordionId, setOpenAccordionId] = useState<number | null>(null);

  const toggleAccordion = (id: number) => {
    setOpenAccordionId(openAccordionId === id ? null : id);
  };

  // Palet Warna (konsisten dengan landing page utama)
  const colors = {
    background: '#F0F7F8', // Sama seperti AboutSection
    primaryDark: '#1A0A3B',
    primaryBlue: '#1E47A0',
    accentCyan: '#A0D0D5',
  };

  return (
    <section className={`min-h-screen py-20 lg:py-28 bg-[${colors.background}] text-[${colors.primaryDark}] relative overflow-hidden`}>
      <FloatingParticles particleColor={`${colors.accentCyan}/20`} count={6} className="opacity-40"/>
      {/* Decorative Shapes - Subtle */}
      <div aria-hidden="true" className={`absolute top-1/4 -right-1/4 w-1/2 h-1/2 bg-gradient-to-bl from-[${colors.primaryBlue}]/5 to-transparent rounded-full filter blur-3xl animate-pulse-slower opacity-50`}></div>
      <div aria-hidden="true" className={`absolute bottom-1/4 -left-1/4 w-1/2 h-1/2 bg-gradient-to-tr from-[${colors.accentCyan}]/10 to-transparent rounded-full filter blur-3xl animate-pulse-slow opacity-50`} style={{animationDelay: '1.5s'}}></div>


      <div className="container mx-auto max-w-3xl px-6 relative z-10">
        <FadeInUp className="text-center mb-12 md:mb-16">
          <div className="inline-block p-3 bg-white/70 rounded-full shadow-md mb-4">
            <QuestionMarkCircleIcon className={`w-10 h-10 text-[${colors.primaryBlue}]`} />
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-[${colors.primaryDark}] my-3 tracking-tight leading-tight">
            Pertanyaan Umum (FAQ)
          </h2>
          <p className={`text-lg md:text-xl text-[${colors.primaryBlue}]/90 leading-relaxed max-w-2xl mx-auto`}>
            Temukan jawaban cepat untuk pertanyaan umum tentang HealthAuth. Jika Anda tidak menemukan yang Anda cari, tim kami siap membantu.
          </p>
        </FadeInUp>

        <FadeInUp delay="delay-200" className="bg-white/70 backdrop-blur-xl shadow-2xl rounded-2xl p-6 md:p-8 border border-white/50">
          <div className="divide-y divide-[#A0D0D5]/40">
            {qnaData.map((item) => (
              <QnaItem
                key={item.id}
                item={item}
                isOpen={openAccordionId === item.id}
                onClick={() => toggleAccordion(item.id)}
              />
            ))}
          </div>
        </FadeInUp>

        <FadeInUp delay="delay-400" className="mt-16 text-center">
            <div className="inline-block p-3 bg-white/70 rounded-full shadow-md mb-4">
                <ChatBubbleLeftRightIcon className={`w-10 h-10 text-[${colors.primaryBlue}]`} />
            </div>
            <h3 className="text-2xl font-semibold text-[${colors.primaryDark}] mb-3">Masih Ada Pertanyaan?</h3>
            <p className={`text-md text-[${colors.primaryBlue}]/90 mb-6 max-w-md mx-auto`}>
                Tim dukungan kami selalu siap membantu Anda. Jangan ragu untuk menghubungi kami melalui halaman kontak.
            </p>
            <button className={`bg-gradient-to-r from-[${colors.primaryBlue}] to-[#123A7A] text-white font-semibold py-3.5 px-8 rounded-xl shadow-lg hover:shadow-[${colors.primaryBlue}]/50 transform hover:scale-105 transition-all duration-300 flex items-center group mx-auto`}>
                Hubungi Kami Sekarang
                <ArrowRightIcon className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1"/>
            </button>
        </FadeInUp>
      </div>
    </section>
  );
};

// Asumsikan ArrowRightIcon juga perlu diimpor jika tombol "Hubungi Kami" digunakan
// import { ArrowRightIcon } from '@heroicons/react/24/outline';
// (Sudah saya tambahkan ChatBubbleLeftRightIcon untuk variasi)

export default Qna;