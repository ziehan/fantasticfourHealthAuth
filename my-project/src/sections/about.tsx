// components/about.tsx
'use client';

import React, { useEffect, useState } from 'react';
import {
  ArrowRightIcon,
  LightBulbIcon,
  UsersIcon,
  AcademicCapIcon,
  SparklesIcon,
  FaceSmileIcon,
  AdjustmentsHorizontalIcon,
  ShieldCheckIcon,
  RocketLaunchIcon,
  PaperAirplaneIcon
} from '@heroicons/react/24/outline';

// --- Definisi Interface untuk Komponen Bantuan ---
interface FadeInUpProps {
  children: React.ReactNode;
  delay?: string; // e.g., 'delay-100', 'delay-200'
  duration?: string; // e.g., 'duration-700', 'duration-1000'
  className?: string;
  as?: React.ElementType; // Untuk merender sebagai elemen HTML yang berbeda
}

interface FloatingParticlesProps {
  particleColor?: string; // e.g., 'bg-blue-500/10'
  count?: number;
  className?: string;
}

// --- Implementasi Komponen Bantuan (FadeInUp & FloatingParticles) ---
// Anda bisa memindahkan ini ke file utilitas terpisah jika digunakan di banyak tempat

const FadeInUp: React.FC<FadeInUpProps> = ({
  children,
  delay = '',
  duration = 'duration-1000',
  className = '',
  as: Component = 'div', // Default ke 'div'
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Sedikit penundaan untuk memastikan elemen ada di DOM sebelum transisi
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 50); // Penundaan singkat, bisa disesuaikan
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
  particleColor = "bg-[#A0D0D5]/10", // Warna default dari tema Anda
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
          opacity: Math.random() * 0.3 + 0.05, // Opacity acak yang halus
        }}
      />
    ))}
  </div>
);

// --- Komponen About Section Utama ---
const About: React.FC = () => {
  // Data untuk bagian nilai-nilai dan timeline bisa juga dijadikan props jika diperlukan
  const coreValues = [
    { icon: LightBulbIcon, title: "Inovasi Berkelanjutan", text: "Terus berinovasi untuk solusi medis terdepan yang relevan dengan tantangan masa kini dan mendatang.", color: "text-red-500", bgColor:"bg-red-50" },
    { icon: UsersIcon, title: "Pendekatan Human-Centered", text: "Setiap fitur dirancang dengan memprioritaskan kebutuhan, kenyamanan, dan pengalaman pengguna.", color: "text-green-500", bgColor:"bg-green-50" },
    { icon: ShieldCheckIcon, title: "Integritas & Keamanan Data", text: "Menjamin privasi dan proteksi data Anda dengan standar keamanan tertinggi dan praktik etis.", color: "text-blue-500", bgColor:"bg-blue-50" },
  ];

  const timelineData = [
    { year: "2023", title: "Konsep & Riset Awal", text: "Mengidentifikasi tantangan utama nakes dan merumuskan visi HealthAuth.", icon: LightBulbIcon, align: "left" },
    { year: "2024", title: "Pengembangan Platform MVP", text: "Membangun produk minimum yang layak dengan fitur inti dan pengujian terbatas.", icon: RocketLaunchIcon, align: "right" },
    { year: "2025", title: "Peluncuran & Kemitraan Strategis", text: "Memperkenalkan HealthAuth ke publik dan menjalin kolaborasi dengan institusi kesehatan.", icon: PaperAirplaneIcon, align: "left" },
  ];

  return (
    <section className="min-h-screen py-20 lg:py-28 bg-[#F0F7F8] text-[#1A0A3B] relative overflow-hidden">
      <FloatingParticles particleColor="bg-[#A0D0D5]/30" count={8} className="opacity-50"/>
      {/* Decorative Shapes */}
      <div aria-hidden="true" className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-gradient-to-br from-[#A0D0D5]/20 to-transparent rounded-full filter blur-3xl animate-pulse-slow"></div>
      <div aria-hidden="true" className="absolute bottom-0 -right-1/4 w-1/2 h-1/2 bg-gradient-to-tl from-[#1E47A0]/10 to-transparent rounded-full filter blur-3xl animate-pulse-slower" style={{animationDelay: '2s'}}></div> {/* Menggunakan inline style untuk animation-delay */}

      <div className="container mx-auto max-w-6xl px-6 relative z-10">
        <FadeInUp className="text-center mb-16">
          <span className="text-sm font-bold text-[#1E47A0] uppercase tracking-wider">Tentang Kami</span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#1A0A3B] my-4 tracking-tight leading-tight">
            Misi Kami: Merevolusi Kesejahteraan & Efektivitas Medis
          </h2>
          <p className="text-lg md:text-xl text-[#1E47A0]/90 leading-relaxed max-w-3xl mx-auto">
            HealthAuth lahir dari dedikasi untuk memahami dan menjawab tantangan kompleks yang dihadapi para profesional medis. Kami adalah mitra Anda dalam membangun masa depan layanan kesehatan yang lebih resilien dan berpusat pada manusia.
          </p>
        </FadeInUp>

        {/* Grid Utama: Filosofi & Tim */}
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-start mb-20">
          {/* Kolom Kiri: Filosofi & Narasi */}
          <div className="text-left">
            <FadeInUp delay="delay-100">
              <h3 className="text-2xl md:text-3xl font-bold text-[#1A0A3B] mb-6 flex items-center">
                <LightBulbIcon className="w-8 h-8 inline mr-3 text-red-400 shrink-0" />
                Filosofi Inti Kami
              </h3>
              <p className="text-lg text-[#1E47A0] leading-relaxed mb-6">
                Kami percaya bahwa profesional medis yang sejahtera, didukung oleh teknologi intuitif, adalah kunci layanan kesehatan berkualitas tinggi. Setiap solusi HealthAuth dirancang dengan empati, berakar pada riset, dan bertujuan untuk memberdayakan Anda.
              </p>
              <p className="text-md text-gray-700 leading-relaxed mb-8">
                Dari deteksi dini burnout hingga dukungan keputusan klinis berbasis AI, platform kami dirancang untuk meringankan beban administratif dan kognitif, sehingga Anda dapat fokus pada hal terpenting: perawatan pasien.
              </p>
            </FadeInUp>
            <FadeInUp delay="delay-200">
              <button className="bg-gradient-to-r from-[#1E47A0] to-[#123A7A] text-white font-semibold py-3.5 px-8 rounded-xl shadow-lg hover:shadow-[#1E47A0]/50 transform hover:scale-105 transition-all duration-300 flex items-center group">
                Pelajari Dampak Kami <ArrowRightIcon className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1"/>
              </button>
            </FadeInUp>
          </div>

          {/* Kolom Kanan: Tim Kami (Konseptual) */}
          <FadeInUp delay="delay-300" className="bg-white/60 backdrop-blur-xl p-8 rounded-2xl shadow-xl border border-white/50">
            <h3 className="text-2xl md:text-3xl font-bold text-[#1A0A3B] mb-6 text-center md:text-left flex items-center">
              <UsersIcon className="w-8 h-8 inline mr-3 text-green-500 shrink-0" />
              Dibangun Oleh Tim Ahli
            </h3>
            <p className="text-md text-gray-700 leading-relaxed mb-6">
              HealthAuth adalah hasil kolaborasi para ahli di bidang kedokteran, teknologi AI, psikologi, dan desain pengalaman pengguna. Kami bersatu dengan visi yang sama: menciptakan solusi yang benar-benar memahami dan melayani kebutuhan Anda.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center p-3 bg-green-100/50 rounded-lg">
                <AcademicCapIcon className="w-6 h-6 mr-2 text-green-600 shrink-0"/> Profesional Medis Berpengalaman
              </div>
              <div className="flex items-center p-3 bg-sky-100/50 rounded-lg">
                <SparklesIcon className="w-6 h-6 mr-2 text-sky-600 shrink-0"/> Insinyur AI & Data Scientist
              </div>
              <div className="flex items-center p-3 bg-red-100/50 rounded-lg">
                <FaceSmileIcon className="w-6 h-6 mr-2 text-red-600 shrink-0"/> Pakar Psikologi & Kesejahteraan
              </div>
              <div className="flex items-center p-3 bg-purple-100/50 rounded-lg">
                 <AdjustmentsHorizontalIcon className="w-6 h-6 mr-2 text-purple-600 shrink-0"/> Desainer UX/UI Inovatif
              </div>
            </div>
          </FadeInUp>
        </div>

        {/* Nilai-Nilai Inti Kami */}
        <FadeInUp delay="delay-400" className="mb-20">
          <h3 className="text-3xl md:text-4xl font-bold text-[#1A0A3B] mb-12 text-center">Nilai yang Kami Junjung Tinggi</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {coreValues.map((item) => (
              <div key={item.title} className={`flex flex-col items-center text-center p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 ${item.bgColor} border border-black/5`}>
                <div className={`p-4 rounded-full bg-white/70 shadow-md mb-5 inline-block`}>
                  <item.icon className={`w-10 h-10 ${item.color}`} />
                </div>
                <h4 className="font-semibold text-xl text-[#1A0A3B] mb-2">{item.title}</h4>
                <p className="text-sm text-gray-600 leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </FadeInUp>

        {/* Perjalanan Kami (Timeline Konseptual) */}
        <FadeInUp delay="delay-500">
          <h3 className="text-3xl md:text-4xl font-bold text-[#1A0A3B] mb-12 text-center">Jejak Langkah HealthAuth</h3>
          <div className="relative">
            {/* Garis Timeline */}
            <div aria-hidden="true" className="hidden md:block absolute top-5 left-1/2 w-1 bg-[#A0D0D5] h-[calc(100%-2.5rem)] -translate-x-1/2"></div>

            {/* Item Timeline */}
            {timelineData.map((item, index) => (
              <div key={index} className={`mb-12 md:mb-16 flex md:items-center w-full ${item.align === 'left' ? 'md:flex-row-reverse' : ''}`}>
                <div className="hidden md:block w-1/2"></div> {/* Spacer untuk layout desktop */}
                <div className={`md:w-1/2 ${item.align === 'left' ? 'md:pr-8 md:text-right' : 'md:pl-8 md:text-left'}`}>
                  <div aria-hidden="true" className="absolute hidden md:block bg-white border-2 border-[#A0D0D5] p-2 rounded-full shadow-lg transform -translate-y-1/2" style={item.align === 'left' ? {right: 'calc(50% - 1.25rem)', top: '1.25rem'} : {left: 'calc(50% - 1.25rem)', top: '1.25rem'}}> {/* Penyesuaian posisi vertikal ikon timeline */}
                      <item.icon className="w-6 h-6 text-[#1E47A0]" />
                  </div>
                  <div className="bg-white/80 backdrop-blur-lg p-6 rounded-xl shadow-lg border border-black/5 relative">
                    <span className="text-xs font-bold text-[#1E47A0] uppercase">{item.year}</span>
                    <h4 className="text-xl font-semibold text-[#1A0A3B] mt-1 mb-2">{item.title}</h4>
                    <p className="text-sm text-gray-600">{item.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </FadeInUp>
      </div>
    </section>
  );
};

export default About;