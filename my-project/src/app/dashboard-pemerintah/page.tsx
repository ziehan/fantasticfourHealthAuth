// pages/DashboardPemerintahPageV2.tsx (atau app/dashboard-pemerintah-v2/page.tsx)
"use client";

import Navbar from './sections/navbar';
import Footer from './sections/footer';
import React, { useEffect, useState } from 'react';
import {
  ChevronDownIcon as HeroChevronDownIcon,
  ArrowDownTrayIcon,
  UsersIcon,
  MapPinIcon,
  ChartBarIcon,
  DocumentTextIcon,
  BellAlertIcon,
  BuildingOffice2Icon,
  ArrowRightIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  PlusCircleIcon,
  InformationCircleIcon as InformationCircleSolidIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';

// --- Data Dummy (Disesuaikan) ---
const kpiData = [
  { id: 1, label: "Total Nakes Aktif", value: "1,250,800", trend: "+5.2%", icon: UserGroupIcon, color: "text-[#A0D0D5]", unit: "Nakes" },
  { id: 2, label: "Institusi Terintegrasi", value: "15,670", trend: "+2.8%", icon: BuildingOffice2Icon, color: "text-[#E0F2F3]", unit: "Institusi" },
  { id: 3, label: "Kepatuhan Pelaporan (%)", value: "78%", trend: "-1.5%", icon: ShieldCheckIcon, color: "text-[#A0D0D5]", isWarning: true, unit: "% dari Target" },
];

interface RegionalDataItem {
  id: number;
  region: string;
  partisipasiNakes: string;
  indeksKesehatanMental: number; // Skala 1-10
  statusKesiapsiagaan: "Sangat Baik" | "Baik" | "Cukup" | "Kurang";
  trendBurnout: "menurun" | "stabil" | "meningkat";
}

const regionalData: RegionalDataItem[] = [
  { id: 1, region: "DKI Jakarta", partisipasiNakes: "92%", indeksKesehatanMental: 7.8, statusKesiapsiagaan: "Sangat Baik", trendBurnout: "menurun" },
  { id: 2, region: "Jawa Barat", partisipasiNakes: "85%", indeksKesehatanMental: 7.2, statusKesiapsiagaan: "Baik", trendBurnout: "stabil" },
  { id: 3, region: "Jawa Timur", partisipasiNakes: "88%", indeksKesehatanMental: 7.5, statusKesiapsiagaan: "Baik", trendBurnout: "menurun" },
  { id: 4, region: "Sumatera Utara", partisipasiNakes: "75%", indeksKesehatanMental: 6.9, statusKesiapsiagaan: "Cukup", trendBurnout: "meningkat" },
  { id: 5, region: "Papua", partisipasiNakes: "60%", indeksKesehatanMental: 6.2, statusKesiapsiagaan: "Kurang", trendBurnout: "meningkat" },
  // Tambah data untuk memastikan scroll berfungsi jika perlu
  { id: 6, region: "Sulawesi Selatan", partisipasiNakes: "70%", indeksKesehatanMental: 7.1, statusKesiapsiagaan: "Cukup", trendBurnout: "stabil" },
  { id: 7, region: "Kalimantan Timur", partisipasiNakes: "80%", indeksKesehatanMental: 7.3, statusKesiapsiagaan: "Baik", trendBurnout: "menurun" },
];

const reportTypes = [
  { id: 1, name: "Laporan Nasional Tren Burnout Nakes (Q2 2025)", lastGenerated: "30 Mei 2025", icon: DocumentTextIcon, size: "2.5 MB", format: "PDF" },
  { id: 2, name: "Ringkasan Partisipasi Survei Kesiapsiagaan Krisis", lastGenerated: "28 Mei 2025", icon: DocumentTextIcon, size: "1.8 MB", format: "PDF" },
  { id: 3, name: "Analisis Komparatif Indeks Kesehatan Mental Antar Provinsi", lastGenerated: "15 Mei 2025", icon: ChartBarIcon, size: "3.1 MB", format: "XLSX" },
  { id: 4, name: "Laporan Kepatuhan Pengisian Log Harian Nasional", lastGenerated: "10 Mei 2025", icon: DocumentTextIcon, size: "1.2 MB", format: "PDF" },
  { id: 5, name: "Evaluasi Program Pelatihan Nakes Nasional", lastGenerated: "05 Mei 2025", icon: ChartBarIcon, size: "2.1 MB", format: "PDF" },
];

const announcementData = [
    {id: 1, title: "Update Pedoman Kesiapsiagaan Bencana Nasional Versi 3.0", date: "25 Mei 2025", status: "Terkirim", audience: "Semua Institusi", dibaca: 12500, totalTarget: 15670},
    {id: 2, title: "Sosialisasi Program Pelatihan Manajemen Stres Nakes", date: "10 Mei 2025", status: "Terjadwal", audience: "Nakes - Regional Jawa & Sumatera", dibaca: 0, totalTarget: 600000},
    {id: 3, title: "Peringatan Dini Potensi Krisis Kesehatan Regional X", date: "05 Mei 2025", status: "Terkirim Mendesak", audience: "Institusi - Regional X", dibaca: 300, totalTarget: 320},
    {id: 4, title: "Jadwal Vaksinasi Nasional Tahap Berikutnya", date: "01 Mei 2025", status: "Terkirim", audience: "Semua Pengguna", dibaca: 1050000, totalTarget: 1250800},
];

// --- Komponen Animasi Entri ---
interface FadeInUpProps { children: React.ReactNode; delay?: string; duration?: string; className?: string; as?: React.ElementType }
const FadeInUp: React.FC<FadeInUpProps> = ({ children, delay = '', duration = 'duration-1000', className = '', as: Component = 'div' }) => {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);
  return (
    <Component className={`transition-all ease-out ${duration} ${delay} ${className} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      {children}
    </Component>
  );
};

// --- Komponen Latar Belakang Bentuk Geometris Halus ---
const FloatingGeometricShapes: React.FC<{ shapeClassName?: string; count?: number; className?: string }> = ({ shapeClassName = "bg-[#A0D0D5]/5", count = 10, className = "" }) => (
  <div className={`absolute inset-0 overflow-hidden -z-10 ${className}`}> {/* Perbaikan: Template literal */}
    {[...Array(count)].map((_, i) => {
      const size = Math.random() * 80 + 40;
      const type = Math.random();
      return (
        <div
          key={i}
          className={`absolute ${shapeClassName} animate-float`} 
          style={{
            width: `${size}px`,
            height: `${size}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 8}s`,
            animationDuration: `${Math.random() * 20 + 15}s`,
            opacity: Math.random() * 0.15 + 0.05,
            clipPath: type < 0.33 ? 'circle(50%)' : (type < 0.66 ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)')
          }}
        />
      );
    })}
  </div>
);

const DashboardPemerintahPageV2: React.FC = () => {
  const getKesiapsiagaanColor = (status: RegionalDataItem['statusKesiapsiagaan']) => {
    if (status === "Sangat Baik") return "text-green-400 bg-green-500/10 border border-green-500/30";
    if (status === "Baik") return "text-sky-400 bg-sky-500/10 border border-sky-500/30";
    if (status === "Cukup") return "text-yellow-400 bg-yellow-500/10 border border-yellow-500/30";
    if (status === "Kurang") return "text-red-400 bg-red-500/10 border border-red-500/30";
    return "text-gray-400 bg-gray-500/10 border border-gray-500/30";
  };

  // Tidak ada state atau memo yang tidak terpakai lagi

  return (
    <div className="scroll-smooth selection:bg-[#A0D0D5] selection:text-[#1A0A3B]">
      <Navbar />
      {/* === 1. Hero Section: Ringkasan Eksekutif & KPI Nasional === */}
      <section className="min-h-screen h-auto flex flex-col items-center justify-center bg-gradient-to-br from-[#1A0A3B] via-[#1E47A0] to-[#123A7A] text-[#E0F2F3] p-6 md:p-8 relative overflow-hidden"> {/* Penyesuaian: min-h-screen & h-auto, padding responsif */}
        <FloatingGeometricShapes shapeClassName="bg-[#A0D0D5]/5" count={15}/>
        <div className="absolute inset-0 bg-gradient-to-tr from-black/30 via-transparent to-black/30 -z-1"></div>

        <FadeInUp className="text-center mb-10 md:mb-16"> {/* Penyesuaian: margin bottom lebih besar */}
          <span className="inline-block bg-white/10 text-[#A0D0D5] text-xs font-bold px-4 py-1.5 rounded-full mb-4 tracking-wider uppercase shadow-sm">Dashboard Eksekutif Pemerintah</span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
            Status Kesehatan & Kesiapsiagaan Nasional
          </h1>
          <p className="mt-5 text-lg text-[#A0D0D5]/80 max-w-3xl mx-auto"> {/* Penyesuaian: margin top sedikit ditambah */}
            Analisis data terpusat untuk pengambilan keputusan strategis dan peningkatan layanan kesehatan di seluruh Indonesia.
          </p>
        </FadeInUp>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl w-full px-4"> {/* Penyesuaian: max-w-6xl untuk mengakomodasi gap lebih baik */}
          {kpiData.map((kpi, index) => (
            <FadeInUp key={kpi.id} delay={`delay-[${200 + index * 150}ms]`} className="w-full">
              <div className="bg-clip-padding backdrop-filter backdrop-blur-xl bg-white/10 border border-white/15 shadow-2xl rounded-2xl p-6 text-center h-full flex flex-col justify-between items-center transition-all duration-300 hover:bg-white/20 hover:shadow-[#A0D0D5]/40 transform hover:-translate-y-2">
                <div className='w-full'>
                  <div className="flex justify-between items-start w-full mb-3">
                    <kpi.icon className={`w-9 h-9 ${kpi.color} transition-colors duration-300`} />
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${kpi.trend.startsWith('+') ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                      {kpi.trend}
                    </span>
                  </div>
                  <p className="text-3xl lg:text-4xl font-bold text-white mb-1.5">{kpi.value}</p> {/* Penyesuaian: margin bottom sedikit ditambah */}
                  <p className="text-sm font-medium text-[#E0F2F3]/90 mb-1">{kpi.label}</p>
                </div>
                <p className="text-xs text-[#A0D0D5]/70 mt-3">{kpi.unit}</p> {/* Penyesuaian: margin top ditambah */}
              </div>
            </FadeInUp>
          ))}
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-60">
          <HeroChevronDownIcon className="w-10 h-10 text-[#A0D0D5]" />
        </div>
      </section>

      {/* === 2. Pemetaan & Distribusi Data Kesehatan === */}
      <section id='Data' className="min-h-screen h-auto flex flex-col items-center justify-center bg-[#E0F2F3] p-6 md:p-8 relative overflow-hidden"> {/* Penyesuaian: min-h-screen & h-auto, padding responsif */}
        <FloatingGeometricShapes shapeClassName="bg-[#A0D0D5]/50" count={10} className="opacity-70"/>
        <div className="absolute -bottom-1/4 -left-1/4 w-3/4 h-3/4 bg-gradient-to-tr from-[#A0D0D5]/50 to-transparent rounded-full filter blur-3xl opacity-60 animate-pulse-slower"></div>
        <div className="container mx-auto max-w-6xl w-full text-center flex flex-col h-full pt-12 md:pt-16"> {/* Penyesuaian: padding top ditambah */}
          <FadeInUp>
            <h2 className="text-4xl md:text-5xl font-bold text-[#1A0A3B] mb-4 tracking-tight">Pemetaan Data Kesehatan Nasional</h2> {/* Penyesuaian: margin bottom sedikit disesuaikan */}
            <p className="text-lg text-[#1E47A0]/90 mb-10 md:mb-12 max-w-3xl mx-auto">Visualisasikan data secara geografis untuk identifikasi area prioritas dan alokasi sumber daya yang lebih efektif.</p> {/* Penyesuaian: margin bottom ditambah */}
          </FadeInUp>

          <div className="flex-grow grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch min-h-0">
            <FadeInUp delay="delay-[200ms]" className="lg:col-span-8 bg-white/80 backdrop-blur-xl p-6 md:p-8 rounded-2xl shadow-2xl border border-white/60 flex flex-col items-center justify-center transform hover:shadow-cyan-400/20 transition-shadow duration-300"> {/* Penyesuaian: padding responsif */}
              <MapPinIcon className="w-20 h-20 sm:w-28 sm:h-28 text-[#A0D0D5] mb-5" /> {/* Penyesuaian: margin bottom ditambah */}
              <h3 className="text-2xl font-semibold text-[#1A0A3B] mb-3">Peta Interaktif Sebaran Data</h3> {/* Penyesuaian: margin bottom ditambah */}
              <p className="text-gray-600 text-center max-w-md text-sm mb-6"> {/* Penyesuaian: margin bottom ditambah */}
                (Placeholder untuk komponen peta. Menampilkan data partisipasi Nakes, Indeks Kesehatan Mental, dan Status Kesiapsiagaan per wilayah dengan filter interaktif.)
              </p>
              <button className="mt-auto bg-gradient-to-r from-[#1E47A0] to-[#123A7A] text-white font-semibold py-3 px-8 rounded-xl shadow-lg hover:from-[#123A7A] hover:to-[#1E47A0] transform hover:scale-105 transition-all"> {/* Penyesuaian: mt-auto untuk button di bawah jika konten sedikit */}
                Jelajahi Peta Detail
              </button>
            </FadeInUp>

            <FadeInUp delay="delay-[400ms]" className="lg:col-span-4 bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-2xl border border-white/60 flex flex-col">
              <div className="flex justify-between items-center mb-5"> {/* Penyesuaian: margin bottom ditambah */}
                <h3 className="text-xl font-semibold text-[#1A0A3B]">Ringkasan Regional</h3>
                <button className="p-1.5 bg-[#A0D0D5]/30 rounded-md hover:bg-[#A0D0D5]/50 transition-colors"><FunnelIcon className="w-4 h-4 text-[#1E47A0]" /></button>
              </div>
              <div className="space-y-3.5 overflow-y-auto custom-scrollbar pr-2 flex-grow min-h-[200px] md:min-h-[250px]"> {/* Penyesuaian: space-y sedikit ditambah, min-h responsif */}
                {regionalData.map(data => (
                  <div key={data.id} className="p-3.5 bg-[#E0F2F3]/70 rounded-xl border border-[#A0D0D5]/60 hover:shadow-lg hover:border-[#A0D0D5] transition-all duration-200 group">
                    <div className="flex justify-between items-start mb-1"> {/* Penyesuaian: margin bottom dikurangi */}
                      <h4 className="font-semibold text-[#1A0A3B] text-sm group-hover:text-[#1E47A0]">{data.region}</h4>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${getKesiapsiagaanColor(data.statusKesiapsiagaan)}`}>
                        {data.statusKesiapsiagaan}
                      </span>
                    </div>
                    <div className="text-xs text-[#1E47A0]/80 space-y-0.5">
                      <p>Partisipasi Nakes: <span className="font-medium">{data.partisipasiNakes}</span></p>
                      <p>Indeks KM: <span className="font-medium">{data.indeksKesehatanMental}/10</span></p>
                      <p>Tren Burnout: <span className={`font-medium ${data.trendBurnout === 'menurun' ? 'text-green-600' : data.trendBurnout === 'meningkat' ? 'text-red-600' : 'text-gray-600'}`}>{data.trendBurnout}</span></p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="mt-auto pt-4 text-sm text-[#1E47A0] hover:text-[#1A0A3B] font-medium flex items-center self-start group"> {/* Penyesuaian: padding top ditambah */}
                Lihat Semua Data Regional <ArrowRightIcon className="w-4 h-4 ml-1 transition-transform duration-300 group-hover:translate-x-0.5"/>
              </button>
            </FadeInUp>
          </div>
        </div>
      </section>

      {/* === 3. Pusat Analitik & Pelaporan === */}
      <section id='Analitik' className="min-h-screen h-auto flex flex-col items-center justify-center bg-[#A0D0D5] p-6 md:p-8 pt-12 md:pt-16 overflow-y-auto relative custom-scrollbar"> {/* Penyesuaian: padding, min-h-screen & h-auto */}
        <FloatingGeometricShapes shapeClassName="bg-[#E0F2F3]/40" count={12} className="opacity-80"/>
        <div className="container mx-auto max-w-6xl w-full text-center flex flex-col h-full">
          <FadeInUp>
            <h2 className="text-4xl md:text-5xl font-bold text-[#1A0A3B] mb-4 tracking-tight">Pusat Analitik & Pelaporan Strategis</h2> {/* Penyesuaian: margin bottom disesuaikan */}
            <p className="text-lg text-[#1E47A0]/90 mb-10 md:mb-12 max-w-3xl mx-auto">Transformasi data menjadi insight. Akses analitik mendalam dan buat laporan komprehensif dengan mudah.</p> {/* Penyesuaian: margin bottom ditambah */}
          </FadeInUp>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-10 md:mb-12"> {/* Penyesuaian: margin bottom ditambah */}
            {[
              { title: "Analisis Tren Burnout Nasional", icon: ChartBarIcon, color: "text-red-500", dataPeriod: "Kuartal Terakhir" },
              { title: "Efektivitas Program Kesejahteraan", icon: UsersIcon, color: "text-green-500", dataPeriod: "Semester Ini" },
              { title: "Prediksi Kesiapsiagaan Krisis", icon: ShieldCheckIcon, color: "text-blue-500", dataPeriod: "Proyeksi 3 Bulan" },
            ].map((chart, index) => (
              <FadeInUp key={chart.title} delay={`delay-[${100 + index * 100}ms]`}>
                <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white/60 h-full flex flex-col justify-between hover:shadow-2xl hover:border-[#1E47A0]/30 transition-all duration-300 group">
                  <div>
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-semibold text-[#1A0A3B] text-left leading-tight">{chart.title}</h3>
                      <chart.icon className={`w-9 h-9 ${chart.color} opacity-80 group-hover:opacity-100 transition-opacity`} />
                    </div>
                    <p className="text-xs text-gray-500 text-left mb-4">{chart.dataPeriod}</p>
                    <div className="bg-gradient-to-br from-[#E0F2F3]/70 to-white/60 h-44 rounded-md flex items-center justify-center text-gray-400 text-sm border border-[#A0D0D5]/50">
                      (Placeholder Visualisasi Grafik {index + 1})
                    </div>
                  </div>
                  <button className="mt-5 text-xs text-[#1E47A0] hover:text-[#1A0A3B] font-semibold self-start group/link inline-flex items-center">
                    Buka Analisis Detail <ArrowRightIcon className="w-3 h-3 ml-1 transition-transform duration-300 group-hover/link:translate-x-0.5"/>
                  </button>
                </div>
              </FadeInUp>
            ))}
          </div>
          
          <FadeInUp delay="delay-[400ms]" className="bg-white/70 backdrop-blur-xl p-6 md:p-8 rounded-2xl shadow-xl border border-white/50 mt-auto w-full flex-shrink-0"> {/* Penyesuaian: padding responsif */}
             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6"> {/* Penyesuaian: flex-col untuk mobile, margin bottom ditambah */}
               <h3 className="text-2xl font-semibold text-[#1A0A3B] text-left mb-3 sm:mb-0">Generator Laporan</h3>
               <button className="bg-gradient-to-r from-[#1E47A0] to-[#123A7A] text-white font-semibold py-2.5 px-5 rounded-xl shadow-lg hover:from-[#123A7A] hover:to-[#1E47A0] transform hover:scale-105 transition-all text-sm flex items-center self-start sm:self-center">
                 <PlusCircleIcon className="w-5 h-5 mr-2"/> Buat Laporan Kustom
               </button>
             </div>
             <div className="space-y-3.5 max-h-52 overflow-y-auto custom-scrollbar pr-2 py-1"> {/* Penyesuaian: space-y, max-h ditambah */}
               {reportTypes.map(report => (
                  <div key={report.id} className="flex items-center justify-between p-3.5 bg-[#E0F2F3]/80 hover:bg-[#E0F2F3] rounded-xl border border-[#A0D0D5]/60 transition-all duration-200 group">
                    <div className="flex items-center overflow-hidden mr-2">
                      <report.icon className="w-6 h-6 text-[#1E47A0] mr-3 flex-shrink-0"/>
                      <div>
                        <p className="text-sm font-semibold text-[#1A0A3B] truncate group-hover:text-wrap">{report.name}</p>
                        <p className="text-xs text-gray-600">Dibuat: {report.lastGenerated} &bull; {report.size} ({report.format})</p>
                      </div>
                    </div>
                    <button className="p-2 bg-white/60 hover:bg-white rounded-lg text-[#1E47A0] transition-colors shadow-sm transform group-hover:scale-110 flex-shrink-0"> {/* Penyesuaian: flex-shrink-0 */}
                      <ArrowDownTrayIcon className="w-5 h-5"/>
                    </button>
                  </div>
               ))}
             </div>
          </FadeInUp>
        </div>
      </section>

      {/* === 4. Diseminasi Informasi & Kebijakan === */}
      <section id='Informasi' className="min-h-screen h-auto flex flex-col items-center justify-center bg-gradient-to-br from-[#1E47A0] via-[#123A7A] to-[#1A0A3B] p-6 md:p-8 pt-12 md:pt-16 overflow-y-auto relative custom-scrollbar text-[#E0F2F3]"> {/* Penyesuaian: padding, min-h-screen & h-auto */}
        <FloatingGeometricShapes shapeClassName="bg-[#A0D0D5]/15" count={10} className="opacity-80"/>
        <div className="container mx-auto max-w-3xl w-full relative z-10 flex flex-col h-full items-center justify-center">
          <FadeInUp className="text-center w-full">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Pusat Informasi & Kebijakan</h2> {/* Penyesuaian: margin bottom disesuaikan */}
            <p className="text-lg text-[#A0D0D5]/90 mb-10 md:mb-12 max-w-2xl mx-auto">Sebarkan pengumuman, pedoman, dan kebijakan penting secara efektif dan terpusat.</p> {/* Penyesuaian: margin bottom ditambah */}
          </FadeInUp>

          <FadeInUp delay="delay-[200ms]" className="w-full bg-clip-padding backdrop-filter backdrop-blur-xl bg-white/10 border border-white/10 rounded-3xl shadow-2xl p-6 sm:p-8 flex flex-col min-h-0">
            <div className="flex justify-between items-center mb-6 sm:mb-8"> {/* Penyesuaian: margin bottom ditambah */}
              <h3 className="text-2xl font-semibold text-white flex items-center"><BellAlertIcon className="w-8 h-8 mr-3 text-[#A0D0D5]"/>Buat Pengumuman Baru</h3>
              <button className="text-xs text-[#A0D0D5] hover:text-white font-medium flex items-center p-2 rounded-lg hover:bg-white/5 transition-colors">
                <InformationCircleSolidIcon className="w-4 h-4 mr-1"/> Panduan Penggunaan
              </button>
            </div>
            <form className="space-y-5 mb-8 flex-grow">
              <div>
                <label htmlFor="announcementTitleGov" className="block text-sm font-medium text-[#A0D0D5]/90 mb-1.5">Judul Pengumuman/Kebijakan</label>
                <input type="text" id="announcementTitleGov" placeholder="Contoh: Pedoman Baru Penanganan Stres Nakes Pasca Pandemi" className="w-full bg-white/10 border-2 border-white/20 text-[#E0F2F3] placeholder-[#A0D0D5]/70 rounded-xl p-3 focus:ring-2 focus:ring-[#A0D0D5] focus:border-[#A0D0D5] transition-colors shadow-inner text-sm"/>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="announcementTargetGov" className="block text-sm font-medium text-[#A0D0D5]/90 mb-1.5">Target Audiens</label>
                  <select id="announcementTargetGov" className="w-full bg-white/10 border-2 border-white/20 text-[#E0F2F3] rounded-xl p-3 focus:ring-2 focus:ring-[#A0D0D5] focus:border-[#A0D0D5] transition-colors text-sm custom-scrollbar">
                    <option className="bg-[#1E47A0] text-[#E0F2F3]">Semua Pengguna Terdaftar</option>
                    <option className="bg-[#1E47A0] text-[#E0F2F3]">Semua Nakes</option>
                    <option className="bg-[#1E47A0] text-[#E0F2F3]">Semua Institusi Kesehatan</option>
                    <option className="bg-[#1E47A0] text-[#E0F2F3]">Nakes - Regional Tertentu</option>
                    <option className="bg-[#1E47A0] text-[#E0F2F3]">Institusi - Regional Tertentu</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="announcementPriorityGov" className="block text-sm font-medium text-[#A0D0D5]/90 mb-1.5">Prioritas</label>
                  <select id="announcementPriorityGov" className="w-full bg-white/10 border-2 border-white/20 text-[#E0F2F3] rounded-xl p-3 focus:ring-2 focus:ring-[#A0D0D5] focus:border-[#A0D0D5] transition-colors text-sm custom-scrollbar">
                    <option className="bg-[#1E47A0] text-[#E0F2F3]">Normal</option>
                    <option className="bg-[#1E47A0] text-[#E0F2F3]">Penting</option>
                    <option className="bg-[#1E47A0] text-[#E0F2F3]">Mendesak (Notifikasi Segera)</option>
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor="announcementMessageGov" className="block text-sm font-medium text-[#A0D0D5]/90 mb-1.5">Isi Pesan (Mendukung Markdown)</label>
                <textarea id="announcementMessageGov" rows={5} placeholder="Tuliskan isi pengumuman atau kebijakan di sini..." className="w-full bg-white/10 border-2 border-white/20 text-[#E0F2F3] placeholder-[#A0D0D5]/70 rounded-xl p-3 focus:ring-2 focus:ring-[#A0D0D5] focus:border-[#A0D0D5] transition-colors shadow-inner text-sm custom-scrollbar"></textarea>
              </div>
              <div className="flex justify-end space-x-3 pt-3"> {/* Penyesuaian: padding top */}
                <button type="button" className="bg-white/10 border border-white/20 text-[#A0D0D5] hover:bg-white/20 font-medium py-2.5 px-6 rounded-lg shadow-sm transition-colors text-sm">Simpan Draft</button>
                <button type="submit" className="bg-gradient-to-r from-[#A0D0D5] to-[#c3e4e7] text-[#1A0A3B] font-bold py-2.5 px-8 rounded-lg shadow-xl hover:from-[#E0F2F3] hover:to-[#A0D0D5] transition-all transform hover:scale-105 text-sm">
                  Terbitkan Informasi
                </button>
              </div>
            </form>
            <div className="border-t border-white/10 mt-auto pt-6 sm:pt-8"> {/* Penyesuaian: padding top */}
              <h4 className="text-xl font-semibold text-white mb-4">Riwayat Informasi Terpublikasi</h4> {/* Penyesuaian: margin bottom */}
              <div className="space-y-3.5 overflow-y-auto custom-scrollbar pr-2 flex-grow max-h-44"> {/* Penyesuaian: space-y, max-h */}
                {announcementData.map(ann => (
                  <div key={ann.id} className="p-3.5 bg-white/5 rounded-xl text-xs border border-white/10 hover:border-white/20 transition-colors group">
                    <div className="flex justify-between items-start mb-1"> {/* Penyesuaian: margin bottom */}
                      <p className="font-semibold text-sm text-white/90 group-hover:text-white">{ann.title}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ann.status.includes("Mendesak") ? "bg-red-500/30 text-red-300" : "bg-sky-500/20 text-sky-300"}`}>{ann.status}</span>
                    </div>
                    <p className="text-[#A0D0D5]/80 mb-0.5">Target: {ann.audience} &bull; Tanggal: {ann.date}</p>
                    <p className="text-[#A0D0D5]/70">Terbaca: {ann.dibaca.toLocaleString()} / {ann.totalTarget.toLocaleString()} ({Math.round((ann.dibaca/ann.totalTarget)*100)}%)</p>
                  </div>
                ))}
                {announcementData.length === 0 && <p className="text-sm text-center text-[#A0D0D5]/70 py-4">Belum ada pengumuman.</p>}
              </div>
            </div>
          </FadeInUp>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default DashboardPemerintahPageV2;