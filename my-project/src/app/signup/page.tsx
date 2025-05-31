// pages/LandingPageV4.tsx
"use client";

import React, { useEffect, useState } from 'react';
import {
  ArrowRightIcon, ChevronDownIcon, PlayCircleIcon,
  AcademicCapIcon, UsersIcon, SparklesIcon, LightBulbIcon, RocketLaunchIcon,
  DocumentTextIcon, ShieldCheckIcon, PaperAirplaneIcon,
  CalendarDaysIcon, ClockIcon, StarIcon as StarOutlineIcon,
  ShareIcon, BookmarkIcon, AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import { ClipboardDocumentCheckIcon, FaceSmileIcon } from '@heroicons/react/24/outline'; // Pastikan ini ada

// --- Definisi Interface (Bisa disempurnakan) ---
interface FeatureCardData {
  colorClass: string;
  title: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  description: string;
  longDescription?: string; // Untuk hover detail
}
interface ArticleCardData {
  id: number;
  imageUrl: string;
  title: string;
  category: string;
  date: string;
  excerpt: string;
  link: string;
  readingTime?: string;
}
interface EducationCardData {
  id: number;
  imageUrl: string;
  title: string;
  type: 'Video' | 'Modul Interaktif' | 'Artikel Ilmiah';
  duration?: string;
  level?: 'Pemula' | 'Menengah' | 'Ahli';
  rating?: number; // 1-5
  students?: number;
  description: string;
  actionText: string;
  actionLink: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
}

// --- Data Dummy yang Lebih Detail & Diperkaya ---
const featureCardsData: FeatureCardData[] = [
  { colorClass: 'text-red-400', title: 'Analisis Burnout', icon: LightBulbIcon, description: "Deteksi dini & personalisasi tingkat stres.", longDescription: "Pahami pola stres Anda dengan analisis mendalam untuk intervensi yang lebih efektif dan tepat waktu." },
  { colorClass: 'text-green-400', title: 'Survei Kustom', icon: ClipboardDocumentCheckIcon, description: "Kumpulkan feedback & data dengan mudah.", longDescription: "Rancang dan sebarkan survei yang disesuaikan untuk mengumpulkan wawasan berharga dari tim atau pasien Anda." },
  { colorClass: 'text-purple-400', title: 'Diagnosis Cerdas', icon: SparklesIcon, description: "Dukungan keputusan klinis berbasis AI.", longDescription: "Tingkatkan akurasi diagnosis dengan bantuan kecerdasan buatan yang menganalisis data kompleks secara cepat." },
  { colorClass: 'text-sky-400', title: 'Kesiapsiagaan Krisis', icon: RocketLaunchIcon, description: "Panduan & simulasi menghadapi krisis.", longDescription: "Persiapkan tim Anda menghadapi situasi tak terduga dengan modul pelatihan dan simulasi krisis interaktif." },
];

const newsCategories = ["Semua", "Teknologi AI", "Kesehatan Mental Nakes", "Praktik Klinis", "Riset Terbaru"];
const newsArticlesData: ArticleCardData[] = [
  { id: 1, imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bWVkaWNhbCUyMHRlY2hub2xvZ3l8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=400&h=250&q=80', title: 'Revolusi AI dalam Diagnosis Medis Modern', category: "Teknologi AI", date: "31 Mei 2025", excerpt: 'Kecerdasan buatan membawa perubahan signifikan dalam kecepatan dan akurasi diagnosis medis, membuka era baru...', readingTime: "5 menit baca", link: '#' },
  { id: 2, imageUrl: 'https://images.unsplash.com/photo-1551076805-e1869033e561?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGhvc3BpdGFsfGVufDB8fDB8fHww&auto=format&fit=crop&w=400&h=250&q=80', title: 'Kesejahteraan Nakes: Tantangan dan Solusi Holistik', category: "Kesehatan Mental Nakes", date: "28 Mei 2025", excerpt: 'Memahami pentingnya dukungan kesehatan mental bagi para garda terdepan layanan kesehatan dan strategi implementasinya...', readingTime: "7 menit baca", link: '#' },
  { id: 3, imageUrl: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZG9jdG9yJTIwcGF0aWVudHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=400&h=250&q=80', title: 'Komunikasi Efektif: Membangun Kepercayaan Pasien', category: "Praktik Klinis", date: "25 Mei 2025", excerpt: 'Strategi komunikasi yang dapat meningkatkan kepercayaan dan kepatuhan pasien, serta hasil pengobatan yang lebih baik...', readingTime: "6 menit baca", link: '#' },
];

const educationCategories = ["Semua", "Komunikasi Interpersonal", "Manajemen Diri & Stres", "Update Klinis", "Inovasi Teknologi Medis"];
const educationModulesData: EducationCardData[] = [
  { id: 1, imageUrl: 'https://images.unsplash.com/photo-1504813184591-0d570a1e0327?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGVkdWNhdGlvbiUyMGhlYWx0aHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=400&h=250&q=80', title: 'Komunikasi Empatik dalam Praktik Klinis', type: 'Modul Interaktif', duration: "3 Jam", level: "Menengah", rating: 5, students: 1203, description: 'Menguasai seni membangun hubungan terapeutik melalui komunikasi yang efektif dan penuh empati.', actionText: 'Mulai Modul', actionLink: '#', icon: UsersIcon },
  { id: 2, imageUrl: 'https://images.unsplash.com/photo-1620121692029-d088224ddc74?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bWVudGFsJTIwaGVhbHRoJTIwYXdhcmVuZXNzfGVufDB8fDB8fHww&auto=format&fit=crop&w=400&h=250&q=80', title: 'Manajemen Stres & Pencegahan Burnout Nakes', type: 'Video', duration: "45 Menit", level: "Pemula", rating: 4, students: 2580, description: 'Teknik praktis dan strategi berbasis bukti untuk menjaga kesejahteraan mental di lingkungan kerja medis.', actionText: 'Tonton Video', actionLink: '#', icon: FaceSmileIcon },
  { id: 3, imageUrl: 'https://images.unsplash.com/photo-1516549655169-882a58652103?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGhlYWx0aCUyMGRhdGF8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=400&h=250&q=80', title: 'Update Terkini Pedoman Tatalaksana Klinis', type: 'Artikel Ilmiah', level: "Ahli", rating: 5, students: 890, description: 'Selalu terdepan dengan pemahaman mendalam mengenai panduan dan protokol klinis terbaru.', actionText: 'Baca Artikel', actionLink: '#', icon: AcademicCapIcon },
];

// --- Komponen Animasi Entri & Partikel (Dipersingkat untuk brevity, asumsikan sama) ---
interface FadeInUpProps { children: React.ReactNode; delay?: string; duration?: string; className?: string; as?: React.ElementType }
const FadeInUp: React.FC<FadeInUpProps> = ({ children, delay = '', duration = 'duration-1000', className = '', as: Component = 'div' }) => { /* ... implementasi sama ... */ const [isVisible, setIsVisible] = useState(false); useEffect(() => { const timer = setTimeout(() => setIsVisible(true), 50); return () => clearTimeout(timer); }, []); return (<Component className={transition-all ease-out ${duration} ${delay} ${className} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}}>{children}</Component>); };
const FloatingParticles: React.FC<{ particleColor?: string; count?: number; className?: string }> = ({ particleColor = "bg-[#A0D0D5]/10", count = 15, className }) => ( <div className={absolute inset-0 overflow-hidden -z-10 ${className}}>{[...Array(count)].map((_, i) => (<div key={i} className={absolute ${particleColor} rounded-full animate-float} style={{width: ${Math.random() * 60 + 20}px, height: ${Math.random() * 60 + 20}px,left: ${Math.random() * 100}%, top: ${Math.random() * 100}%,animationDelay: ${Math.random() * 5}s, animationDuration: ${Math.random() * 15 + 10}s,opacity: Math.random() * 0.3 + 0.05,}}/>))}</div>);

// --- Komponen Utama Landing Page V4 ---
const LandingPageV4: React.FC = () => {
  const [activeNewsCategory, setActiveNewsCategory] = useState("Semua");
  const [activeEduCategory, setActiveEduCategory] = useState("Semua");

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          i < rating 
            ? <StarSolidIcon key={i} className="w-4 h-4 text-yellow-400" /> 
            : <StarOutlineIcon key={i} className="w-4 h-4 text-yellow-400/70" />
        ))}
      </div>
    );
  };

  return (
    <div className="text-[#1A0A3B] scroll-smooth selection:bg-[#A0D0D5] selection:text-[#1A0A3B]">

      {/* === 1. Hero Section === */}
      <section className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#1A0A3B] via-[#1E47A0] to-[#123A7A] text-[#E0F2F3] p-6 relative overflow-hidden">
        <FloatingParticles particleColor="bg-[#A0D0D5]/5" count={25} className="opacity-50"/>
        {/* SVG Shape Backgrounds for more depth */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-1">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute -top-1/4 -left-1/4 w-[150%] h-[150%] opacity-5 animate-pulse-slower">
                <circle cx="20" cy="20" r="40" fill="#A0D0D5" />
            </svg>
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute -bottom-1/4 -right-1/4 w-[120%] h-[120%] opacity-5 animate-pulse-slow">
                <ellipse cx="80" cy="80" rx="45" ry="30" fill="#E0F2F3" />
            </svg>
        </div>
        <div className="absolute inset-0 bg-black/30 -z-1"></div>

        <div className="container mx-auto max-w-screen-xl relative z-10 text-center md:text-left">
          <div className="grid md:grid-cols-12 gap-10 items-center">
            <FadeInUp className="md:col-span-7 md:pr-10">
              <span className="inline-block bg-gradient-to-r from-[#A0D0D5] to-[#c3e4e7] text-[#1A0A3B] text-xs font-bold px-4 py-1.5 rounded-full mb-5 tracking-widest shadow-lg">
                INOVASI KESEHATAN DIGITAL
              </span>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-extrabold tracking-tighter mb-6 leading-tight shadow-text-lg">
                HealthAuth
              </h1>
              <p className="text-xl md:text-2xl lg:text-3xl text-[#A0D0D5] font-semibold mb-6">
                Solusi Terpadu untuk Kesejahteraan & Performa Profesional Medis.
              </p>
              <p className="text-lg text-[#E0F2F3]/90 mb-10 max-w-xl leading-relaxed mx-auto md:mx-0">
                Manfaatkan teknologi canggih untuk deteksi burnout, survei kustom, dukungan diagnosis, dan kesiapsiagaan krisis. Fokus pada pelayanan, kami jaga kesejahteraan Anda.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start mb-10">
                <button className="bg-gradient-to-r from-[#A0D0D5] to-[#E0F2F3] text-[#1A0A3B] font-bold py-4 px-10 rounded-xl shadow-2xl hover:shadow-[#A0D0D5]/60 transform hover:scale-105 transition-all duration-300 ease-in-out text-lg focus:outline-none focus:ring-4 focus:ring-[#A0D0D5]/70 ring-offset-2 ring-offset-[#1A0A3B]">
                  Mulai Sekarang
                </button>
                <button className="bg-transparent border-2 border-[#A0D0D5] text-[#E0F2F3] font-semibold py-4 px-10 rounded-xl hover:bg-[#A0D0D5]/20 transition duration-300 transform hover:scale-105 text-lg focus:outline-none focus:ring-4 focus:ring-[#A0D0D5]/50 ring-offset-2 ring-offset-[#1A0A3B]">
                  Lihat Demo Interaktif
                </button>
              </div>
              <FadeInUp delay="delay-800" className="flex items-center justify-center md:justify-start space-x-3 text-sm text-[#A0D0D5]/80">
                <ShieldCheckIcon className="w-6 h-6 text-[#A0D0D5]" />
                <span>Platform Terdepan, Dipercaya oleh Ribuan Nakes</span>
              </FadeInUp>
            </FadeInUp>

            <div className="md:col-span-5 grid grid-cols-2 gap-5">
              {featureCardsData.map((card, index) => (
                <FadeInUp key={index} delay={delay-${500 + index * 150}} className="h-full group">
                  <div className="bg-clip-padding backdrop-filter backdrop-blur-xl bg-white/10 border border-white/10 p-6 rounded-2xl shadow-2xl text-center h-full flex flex-col justify-around items-center transform transition-all duration-300 hover:bg-white/20 hover:shadow-[#A0D0D5]/40 hover:-translate-y-2 cursor-pointer min-h-[200px]">
                    {card.icon && <card.icon className={w-10 h-10 sm:w-12 sm:h-12 ${card.colorClass} mx-auto mb-3 transition-all duration-300 transform group-hover:scale-125} />}
                    <div>
                      <h3 className="text-md sm:text-lg font-semibold text-[#E0F2F3] mb-1 group-hover:text-white transition-colors">{card.title}</h3>
                      <p className="text-xs sm:text-sm text-[#A0D0D5]/80 line-clamp-2 transition-opacity duration-300 opacity-100 group-hover:opacity-0 h-8 sm:h-10">{card.description}</p>
                      <p className="absolute inset-x-0 bottom-4 px-2 text-xs text-white transition-opacity duration-300 opacity-0 group-hover:opacity-100">{card.longDescription}</p>
                    </div>
                  </div>
                </FadeInUp>
              ))}
            </div>
          </div>
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-50">
          <ChevronDownIcon className="w-12 h-12 text-[#A0D0D5]" />
        </div>
      </section>

      {/* === 2. About HealthAuth Section === */}
      <section className="h-screen flex flex-col items-center justify-center bg-[#E0F2F3] p-6 text-center relative overflow-hidden">
        <FloatingParticles particleColor="bg-[#A0D0D5]/50" count={10}/>
        <div className="absolute -bottom-1/4 -left-1/4 w-3/4 h-3/4 bg-gradient-to-tr from-[#A0D0D5]/40 via-transparent to-transparent rounded-full filter blur-3xl opacity-70 animate-pulse-slower"></div>
        <div className="absolute -top-1/4 -right-1/4 w-3/4 h-3/4 bg-gradient-to-bl from-[#1E47A0]/30 via-transparent to-transparent rounded-full filter blur-3xl opacity-70 animate-pulse-slow animation-delay-2000"></div>

        <FadeInUp className="container mx-auto max-w-5xl relative z-10">
          <div className="bg-white/70 backdrop-blur-2xl p-8 sm:p-12 lg:p-16 rounded-3xl shadow-2xl border-2 border-white/60">
            <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
              <div className="text-left order-2 md:order-1">
                <FadeInUp as="span" delay="delay-100" className="text-sm font-bold text-[#1E47A0] uppercase tracking-wider">Filosofi Kami</FadeInUp>
                <FadeInUp as="h2" delay="delay-200" className="text-4xl md:text-5xl font-bold text-[#1A0A3B] my-4 tracking-tight leading-tight">
                  Memberdayakan Garda Terdepan Kesehatan
                </FadeInUp>
                <FadeInUp delay="delay-300" as="p" className="text-lg text-[#1E47A0] leading-relaxed mb-6">
                  HealthAuth lahir dari empati mendalam terhadap tantangan unik yang dihadapi para profesional medis. Misi kami adalah menciptakan ekosistem digital yang holistik, mendukung kesejahteraan mental, dan mempertajam kapabilitas klinis Anda.
                </FadeInUp>
                <FadeInUp delay="delay-400" as="p" className="text-md text-gray-700 leading-relaxed mb-8">
                  Kami percaya bahwa nakes yang berdaya adalah pilar utama layanan kesehatan prima. Oleh karena itu, setiap fitur HealthAuth dirancang secara intuitif, relevan, dan berdampak nyata bagi efektivitas dan ketenangan Anda dalam bekerja.
                </FadeInUp>
                 <FadeInUp delay="delay-500">
                    <button className="bg-gradient-to-r from-[#1E47A0] to-[#123A7A] text-white font-semibold py-3.5 px-8 rounded-xl shadow-lg hover:shadow-[#1E47A0]/50 transform hover:scale-105 transition-all duration-300 flex items-center group">
                        Jelajahi Nilai Kami <ArrowRightIcon className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1"/>
                    </button>
                 </FadeInUp>
              </div>
              <FadeInUp delay="delay-600" className="order-1 md:order-2 flex flex-col space-y-6">
                {[
                  { icon: LightBulbIcon, title: "Inovasi Berkelanjutan", text: "Riset & pengembangan solusi medis terdepan.", color: "text-red-500", bgColor: "bg-red-100/50" },
                  { icon: UsersIcon, title: "Desain Human-Centered", text: "Pengalaman pengguna intuitif, fokus pada kebutuhan Anda.", color: "text-green-500", bgColor: "bg-green-100/50" },
                  { icon: ShieldCheckIcon, title: "Keamanan Data Terjamin", text: "Privasi dan proteksi data Anda adalah prioritas utama.", color: "text-blue-500", bgColor: "bg-blue-100/50" },
                ].map(item => (
                  <div key={item.title} className={flex items-start p-5 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 ${item.bgColor} border border-black/5}>
                    <item.icon className={w-10 h-10 mr-5 flex-shrink-0 p-2 rounded-full bg-white/70 ${item.color} shadow-md} />
                    <div>
                      <h4 className="font-semibold text-lg text-[#1A0A3B] mb-1">{item.title}</h4>
                      <p className="text-sm text-gray-600">{item.text}</p>
                    </div>
                  </div>
                ))}
              </FadeInUp>
            </div>
          </div>
        </FadeInUp>
      </section>

      {/* === 3. Berita Terkini Section === */}
      <section className="h-screen flex flex-col items-center justify-center bg-[#A0D0D5] p-6 pt-10 sm:pt-12 md:pt-16 overflow-hidden relative">
        <FloatingParticles particleColor="bg-[#E0F2F3]/40" count={12} className="opacity-70"/>
        <div className="container mx-auto max-w-screen-xl w-full relative z-10 flex flex-col h-full">
          <FadeInUp className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-[#1A0A3B] mb-3">Wawasan & Berita Industri Medis</h2>
            <p className="text-lg text-[#1E47A0]/90 mb-8 max-w-2xl mx-auto">
              Tetap terinformasi dengan perkembangan terbaru, riset mendalam, dan analisis tren dari dunia kesehatan.
            </p>
          </FadeInUp>
          
          <FadeInUp delay="delay-200" className="mb-8 flex flex-wrap justify-center items-center gap-2 sm:gap-3 px-4">
            {newsCategories.map(category => (
              <button 
                key={category} 
                onClick={() => setActiveNewsCategory(category)}
                className={`px-5 py-2.5 text-sm font-semibold rounded-full transition-all duration-300 transform hover:scale-105
                  ${activeNewsCategory === category ? 'bg-gradient-to-r from-[#1E47A0] to-[#123A7A] text-white shadow-xl ring-2 ring-offset-2 ring-offset-[#A0D0D5] ring-white/50' : 'bg-white/70 text-[#1A0A3B] hover:bg-white shadow-md'}`}
              >
                {category}
              </button>
            ))}
            <button className="text-sm text-[#1E47A0] hover:text-[#1A0A3B] font-medium ml-2 flex items-center p-2 rounded-lg hover:bg-white/50 transition-colors">
              <AdjustmentsHorizontalIcon className="w-5 h-5 mr-1"/> Filter Lainnya
            </button>
          </FadeInUp>

          <div className="flex-grow relative overflow-x-auto pb-8 custom-scrollbar"> {/* Horizontal scroll untuk kartu */}
            <div className="flex space-x-8 px-8 md:px-0 min-w-max"> {/* min-w-max untuk scrolling */}
              {newsArticlesData.concat(newsArticlesData).map((article, index) => ( // Duplikasi untuk efek scroll tak terbatas (opsional)
                <FadeInUp key={${article.id}-${index}} delay={delay-${300 + index * 100}} className="w-[300px] sm:w-[340px] h-full shrink-0">
                  <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 flex flex-col h-full group border-2 border-transparent hover:border-[#1E47A0]/70">
                    <div className="overflow-hidden h-52 relative">
                        <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"/>
                        <span className="absolute top-3 left-3 text-xs font-bold text-white bg-gradient-to-r from-[#1E47A0] to-[#1A0A3B] px-2.5 py-1 rounded-full shadow-md">{article.category}</span>
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <p className="text-xs text-gray-500 mb-1.5 flex items-center"><CalendarDaysIcon className="w-4 h-4 mr-1.5 text-gray-400"/> {article.date} &bull; {article.readingTime}</p>
                      <h3 className="text-lg font-semibold text-[#1A0A3B] mb-3 line-clamp-2 h-14 group-hover:text-[#1E47A0] transition-colors">{article.title}</h3>
                      <p className="text-gray-600 text-sm mb-5 line-clamp-3 flex-grow">{article.excerpt}</p>
                      <div className="mt-auto flex justify-between items-center">
                        <a href={article.link} className="text-[#1E47A0] hover:text-[#1A0A3B] font-bold transition-colors duration-150 group/link inline-flex items-center text-sm">
                          Baca Detail <ArrowRightIcon className="w-4 h-4 ml-1 transition-transform duration-300 group-hover/link:translate-x-1" />
                        </a>
                        <div className="flex space-x-2">
                          <button className="text-gray-400 hover:text-[#1E47A0] transition-colors"><ShareIcon className="w-4 h-4"/></button>
                          <button className="text-gray-400 hover:text-[#1E47A0] transition-colors"><BookmarkIcon className="w-4 h-4"/></button>
                        </div>
                      </div>
                    </div>
                  </div>
                </FadeInUp>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* === 4. Edukasi Section === */}
      <section className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#1E47A0] via-[#123A7A] to-[#1A0A3B] p-6 pt-10 sm:pt-12 md:pt-16 overflow-hidden relative text-[#E0F2F3]">
        <FloatingParticles particleColor="bg-[#A0D0D5]/15" count={10} className="opacity-80"/>
        <div className="container mx-auto max-w-screen-xl w-full relative z-10 flex flex-col h-full">
          <FadeInUp className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-3">Pusat Edukasi & Pengembangan Profesional</h2>
            <p className="text-lg text-[#A0D0D5]/90 mb-8 max-w-3xl mx-auto">
              Perdalam keahlian, perluas wawasan. Modul interaktif, studi kasus, dan panduan klinis terbaru dirancang khusus untuk Anda.
            </p>
          </FadeInUp>

          <FadeInUp delay="delay-200" className="mb-8 flex flex-wrap justify-center items-center gap-2 sm:gap-3 px-4">
            {educationCategories.map(category => (
              <button 
                key={category} 
                onClick={() => setActiveEduCategory(category)}
                className={`px-5 py-2.5 text-sm font-semibold rounded-full transition-all duration-300 transform hover:scale-105
                  ${activeEduCategory === category ? 'bg-gradient-to-r from-[#A0D0D5] to-[#c3e4e7] text-[#1A0A3B] shadow-xl ring-2 ring-offset-2 ring-offset-[#1E47A0] ring-white/50' : 'bg-white/10 text-[#A0D0D5] hover:bg-white/20 hover:text-white shadow-md'}`}
              >
                {category}
              </button>
            ))}
             <button className="text-sm text-[#A0D0D5] hover:text-white font-medium ml-2 flex items-center p-2 rounded-lg hover:bg-white/10 transition-colors">
              <AdjustmentsHorizontalIcon className="w-5 h-5 mr-1"/> Lainnya
            </button>
          </FadeInUp>
          
          <div className="flex-grow relative overflow-x-auto pb-8 custom-scrollbar">
            <div className="flex space-x-8 px-8 md:px-0 min-w-max">
              {educationModulesData.concat(educationModulesData.slice(0,1)).map((module, index) => ( // Duplikasi untuk efek scroll
                <FadeInUp key={${module.id}-${index}} delay={delay-${300 + index * 100}} className="w-[320px] sm:w-[360px] h-full shrink-0">
                  <div className="bg-clip-padding backdrop-filter backdrop-blur-xl bg-white/10 border border-white/10 rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 hover:shadow-[#A0D0D5]/40 hover:-translate-y-2 flex flex-col h-full group">
                    <div className="overflow-hidden h-56 relative">
                        <img src={module.imageUrl} alt={module.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"/>
                        <div className="absolute top-3 right-3 flex items-center space-x-2">
                            {module.level && <span className="text-xs bg-[#1A0A3B]/80 text-[#E0F2F3] px-2.5 py-1 rounded-full backdrop-blur-sm shadow-sm">{module.level}</span>}
                            {module.icon && <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg shadow-sm"><module.icon className="w-5 h-5 text-[#E0F2F3]"/></div>}
                        </div>
                        {module.duration && <span className="absolute bottom-3 left-3 text-xs bg-[#1A0A3B]/80 text-[#E0F2F3] px-2.5 py-1 rounded-full backdrop-blur-sm shadow-sm flex items-center"><ClockIcon className="w-3 h-3 mr-1"/>{module.duration}</span>}
                        {module.type && <span className="absolute bottom-3 right-3 text-xs bg-[#1A0A3B]/80 text-[#E0F2F3] px-2.5 py-1 rounded-full backdrop-blur-sm shadow-sm">{module.type}</span>}
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <h3 className="text-xl font-semibold text-white mb-2 line-clamp-2 h-14 group-hover:text-[#E0F2F3] transition-colors">{module.title}</h3>
                      <div className="flex items-center space-x-1 mb-3">
                        {module.rating && renderStars(module.rating)}
                        {module.students && <span className="text-xs text-[#A0D0D5]/80">({module.students.toLocaleString()} peserta)</span>}
                      </div>
                      <p className="text-[#A0D0D5]/90 text-sm mb-6 line-clamp-3 flex-grow">{module.description}</p>
                      <button className="w-full bg-gradient-to-r from-[#A0D0D5] to-[#c3e4e7] text-[#1A0A3B] font-bold py-3.5 px-4 rounded-xl hover:from-[#E0F2F3] hover:to-[#A0D0D5] focus:outline-none focus:ring-4 focus:ring-[#A0D0D5]/50 transition-all duration-300 transform group-hover:scale-105 shadow-xl flex items-center justify-center">
                         {module.type === 'Video' ? <PlayCircleIcon className="w-6 h-6 mr-2" /> : module.type === 'Artikel Ilmiah' ? <DocumentTextIcon className="w-6 h-6 mr-2" /> : <AcademicCapIcon className="w-6 h-6 mr-2" />}
                        {module.actionText}
                      </button>
                    </div>
                  </div>
                </FadeInUp>
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* === 5. Newsletter Signup Section === */}
      <section className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#1A0A3B] via-[#123A7A] to-[#1A0A3B] text-[#E0F2F3] p-6 relative overflow-hidden">
        <FloatingParticles particleColor="bg-[#A0D0D5]/15" count={20} className="opacity-70"/>
        <div className="absolute inset-0 MASK_PATTERN_HERE -z-1 opacity-5"></div> {/* Placeholder untuk pola SVG halus */}
        <div className="container mx-auto max-w-2xl text-center relative z-10">
          <FadeInUp>
            <div className="mx-auto mb-8 w-20 h-20 rounded-full bg-gradient-to-br from-[#A0D0D5] to-[#E0F2F3] flex items-center justify-center shadow-2xl">
                <PaperAirplaneIcon className="w-10 h-10 text-[#1A0A3B] transform -rotate-45"/>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
              Terhubung & Dapatkan Wawasan Eksklusif
            </h2>
          </FadeInUp>
          <FadeInUp delay="delay-200">
            <p className="text-lg text-[#A0D0D5]/90 mb-10 leading-relaxed max-w-xl mx-auto">
              Jadilah yang pertama mendapatkan tips kesehatan, riset industri, dan update fitur HealthAuth. Langganan newsletter mingguan kami, tanpa spam, hanya konten berkualitas.
            </p>
          </FadeInUp>
          <FadeInUp delay="delay-400" className="w-full">
            <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto bg-clip-padding backdrop-filter backdrop-blur-xl bg-white/10 border border-white/10 p-4 rounded-2xl shadow-2xl">
              <input
                type="email"
                placeholder="Alamat email profesional Anda"
                className="flex-grow py-4 px-6 rounded-xl text-[#1A0A3B] bg-white/90 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#A0D0D5] shadow-lg sm:text-sm transition-all duration-300 focus:bg-white focus:placeholder-gray-400"
                required
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-[#A0D0D5] to-[#c3e4e7] hover:from-[#E0F2F3] hover:to-[#A0D0D5] text-[#1A0A3B] font-bold py-4 px-8 rounded-xl shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center text-sm sm:text-base focus:outline-none focus:ring-4 focus:ring-[#A0D0D5]/70"
              >
                Langganan
                <ArrowRightIcon className="w-5 h-5 ml-2.5" />
              </button>
            </form>
            <div className="mt-8 flex justify-center items-center space-x-4 text-xs text-[#A0D0D5]/70">
                <span><ShieldCheckIcon className="w-4 h-4 inline mr-1"/> Privasi Terjamin</span>
                <span><UsersIcon className="w-4 h-4 inline mr-1"/> Bergabunglah dengan 5.000+ Nakes</span>
            </div>
          </FadeInUp>
        </div>
      </section>
    </div>
  );
};

export default LandingPageV4;

// Pastikan animasi 'float' dan plugin lain seperti line-clamp ada di CSS global atau tailwind.config.js
// Tambahkan MASK_PATTERN_HERE dengan pola SVG jika diinginkan, misalnya:
// style={{ maskImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Ccircle cx=\'2\' cy=\'2\' r=\'1\' fill=\'black\'/%3E%3C/svg%3E")', maskSize: '20px 20px', maskRepeat: 'repeat' }}
// atau pola lain yang lebih kompleks.