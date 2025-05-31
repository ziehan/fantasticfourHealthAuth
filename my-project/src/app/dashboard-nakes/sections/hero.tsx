// components/hero.tsx
'use client';

import React, { useEffect, useState } from 'react';
import {
  ShieldCheckIcon,
  ChevronDownIcon,
  LightBulbIcon,        // Digunakan oleh featureCardsData
  ClipboardDocumentCheckIcon, // Digunakan oleh featureCardsData
  SparklesIcon,         // Digunakan oleh featureCardsData
  RocketLaunchIcon      // Digunakan oleh featureCardsData
} from '@heroicons/react/24/outline';

// --- Definisi Interface & Data (Spesifik untuk Hero Section) ---
interface FeatureCardData {
  colorClass: string;
  title: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  description: string;
  longDescription?: string; // Untuk hover detail
}

// Data ini spesifik untuk Hero Section, jadi bisa diletakkan di sini
// atau diimpor dari file data terpusat jika digunakan di tempat lain.
const featureCardsData: FeatureCardData[] = [
  { colorClass: 'text-red-400', title: 'Analisis Burnout', icon: LightBulbIcon, description: "Deteksi dini & personalisasi tingkat stres.", longDescription: "Pahami pola stres Anda dengan analisis mendalam untuk intervensi yang lebih efektif dan tepat waktu." },
  { colorClass: 'text-green-400', title: 'Survei Kustom', icon: ClipboardDocumentCheckIcon, description: "Kumpulkan feedback & data dengan mudah.", longDescription: "Rancang dan sebarkan survei yang disesuaikan untuk mengumpulkan wawasan berharga dari tim atau pasien Anda." },
  { colorClass: 'text-purple-400', title: 'Diagnosis Cerdas', icon: SparklesIcon, description: "Dukungan keputusan klinis berbasis AI.", longDescription: "Tingkatkan akurasi diagnosis dengan bantuan kecerdasan buatan yang menganalisis data kompleks secara cepat." },
  { colorClass: 'text-sky-400', title: 'Kesiapsiagaan Krisis', icon: RocketLaunchIcon, description: "Panduan & simulasi menghadapi krisis.", longDescription: "Persiapkan tim Anda menghadapi situasi tak terduga dengan modul pelatihan dan simulasi krisis interaktif." },
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
// Sama seperti di about.tsx, bisa dipindahkan ke file utilitas terpisah.

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
          width: `${Math.random() * 60 + 20}px`,
          height: `${Math.random() * 60 + 20}px`,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 5}s`,
          animationDuration: `${Math.random() * 15 + 10}s`,
          opacity: Math.random() * 0.3 + 0.05,
        }}
      />
    ))}
  </div>
);

// --- Komponen Hero Section Utama ---
const HeroSection: React.FC = () => {
  // Palet Warna (konsisten dengan landing page utama)
  const colors = {
    primaryDark: '#1A0A3B',
    primaryBlue: '#1E47A0',
    accentCyan: '#A0D0D5',
    paleText: '#E0F2F3',
    heroGradientFrom: '#1A0A3B',
    heroGradientVia: '#1E47A0',
    heroGradientTo: '#123A7A',
    buttonAccentFrom: '#A0D0D5',
    buttonAccentTo: '#c3e4e7', // Sedikit lebih terang untuk gradien tombol
  };

  return (
    <section className={`min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[${colors.heroGradientFrom}] via-[${colors.heroGradientVia}] to-[${colors.heroGradientTo}] text-[${colors.paleText}] p-6 relative overflow-hidden`}>
      <FloatingParticles particleColor={`${colors.accentCyan}/5`} count={25} className="opacity-50"/>
      {/* SVG Shape Backgrounds */}
      <div aria-hidden="true" className="absolute top-0 left-0 w-full h-full overflow-hidden -z-1">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute -top-1/4 -left-1/4 w-[150%] h-[150%] opacity-5 animate-pulse-slower">
          <circle cx="20" cy="20" r="40" fill={colors.accentCyan} />
        </svg>
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute -bottom-1/4 -right-1/4 w-[120%] h-[120%] opacity-5 animate-pulse-slow">
          <ellipse cx="80" cy="80" rx="45" ry="30" fill={colors.paleText} />
        </svg>
      </div>
      <div aria-hidden="true" className="absolute inset-0 bg-black/30 -z-1"></div> {/* Overlay gelap tipis */}

      <div className="container mx-auto max-w-screen-xl relative z-10 text-center md:text-left">
        <div className="grid md:grid-cols-12 gap-10 items-center">
          {/* Kolom Kiri: Teks Utama */}
          <FadeInUp className="md:col-span-7 md:pr-10">
            <span className={`inline-block bg-gradient-to-r from-[${colors.buttonAccentFrom}] to-[${colors.buttonAccentTo}] text-[${colors.primaryDark}] text-xs font-bold px-4 py-1.5 rounded-full mb-5 tracking-widest shadow-lg`}>
              INOVASI KESEHATAN DIGITAL
            </span>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-extrabold tracking-tighter mb-6 leading-tight shadow-text-lg">
              HealthAuth
            </h1>
            <p className={`text-xl md:text-2xl lg:text-3xl text-[${colors.accentCyan}] font-semibold mb-6`}>
              Solusi Terpadu untuk Kesejahteraan & Performa Profesional Medis.
            </p>
            <p className={`text-lg text-[${colors.paleText}]/90 mb-10 max-w-xl leading-relaxed mx-auto md:mx-0`}>
              Manfaatkan teknologi canggih untuk deteksi burnout, survei kustom, dukungan diagnosis, dan kesiapsiagaan krisis. Fokus pada pelayanan, kami jaga kesejahteraan Anda.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start mb-10">
              <button className={`bg-gradient-to-r from-[${colors.buttonAccentFrom}] to-[${colors.paleText}] text-[${colors.primaryDark}] font-bold py-4 px-10 rounded-xl shadow-2xl hover:shadow-[${colors.accentCyan}]/60 transform hover:scale-105 transition-all duration-300 ease-in-out text-lg focus:outline-none focus:ring-4 focus:ring-[${colors.accentCyan}]/70 ring-offset-2 ring-offset-[${colors.primaryDark}]`}>
                Mulai Sekarang
              </button>
              <button className={`bg-transparent border-2 border-[${colors.accentCyan}] text-[${colors.paleText}] font-semibold py-4 px-10 rounded-xl hover:bg-[${colors.accentCyan}]/20 transition duration-300 transform hover:scale-105 text-lg focus:outline-none focus:ring-4 focus:ring-[${colors.accentCyan}]/50 ring-offset-2 ring-offset-[${colors.primaryDark}]`}>
                Lihat Demo Interaktif
              </button>
            </div>
            <FadeInUp delay="delay-800" className={`flex items-center justify-center md:justify-start space-x-3 text-sm text-[${colors.accentCyan}]/80`}>
              <ShieldCheckIcon className={`w-6 h-6 text-[${colors.accentCyan}]`} />
              <span>Platform Terdepan, Dipercaya oleh Ribuan Nakes</span>
            </FadeInUp>
          </FadeInUp>

          {/* Kolom Kanan: Kartu Fitur */}
          <div className="md:col-span-5 grid grid-cols-2 gap-5">
            {featureCardsData.map((card, index) => (
              // PENTING: Kelas delay dinamis seperti ini memerlukan konfigurasi Tailwind JIT
              // yang tepat (safelisting) atau bisa diganti dengan inline style untuk animation-delay.
              <FadeInUp key={index} delay={`delay-${500 + index * 150}`} className="h-full group">
                <div className="bg-clip-padding backdrop-filter backdrop-blur-xl bg-white/10 border border-white/10 p-6 rounded-2xl shadow-2xl text-center h-full flex flex-col justify-around items-center transform transition-all duration-300 hover:bg-white/20 hover:shadow-[#A0D0D5]/40 hover:-translate-y-2 cursor-pointer min-h-[200px]">
                  {card.icon && <card.icon className={`w-10 h-10 sm:w-12 sm:h-12 ${card.colorClass} mx-auto mb-3 transition-all duration-300 transform group-hover:scale-125`} />}
                  <div>
                    <h3 className={`text-md sm:text-lg font-semibold text-[${colors.paleText}] mb-1 group-hover:text-white transition-colors`}>{card.title}</h3>
                    {/* Deskripsi singkat & panjang dengan efek hover */}
                    <div className="relative h-10 sm:h-12"> {/* Kontainer untuk deskripsi agar layout stabil */}
                      <p className={`absolute inset-0 text-xs sm:text-sm text-[${colors.accentCyan}]/80 line-clamp-2 transition-opacity duration-300 opacity-100 group-hover:opacity-0`}>{card.description}</p>
                      <p className={`absolute inset-0 pt-1 px-1 text-xs text-white transition-opacity duration-300 opacity-0 group-hover:opacity-100 flex items-center justify-center`}>{card.longDescription}</p>
                    </div>
                  </div>
                </div>
              </FadeInUp>
            ))}
          </div>
        </div>
      </div>
      {/* Tombol Scroll Down */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-50">
        <ChevronDownIcon className={`w-12 h-12 text-[${colors.accentCyan}]`} />
      </div>
    </section>
  );
};

export default HeroSection;