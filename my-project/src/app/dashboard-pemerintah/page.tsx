// app/dashboard-nakes/page.tsx
"use client";

// Asumsi folder 'sections' ada di 'app/sections/'
// Jika 'sections' ada di root proyek, gunakan '../../../sections/navbar'
import Navbar from './sections/navbar';
import Footer from './sections/footer';

import React, { useEffect, useState, useMemo } from 'react';
import {
  UserCircleIcon,
  PencilSquareIcon,
  MagnifyingGlassIcon,
  PlayCircleIcon,
  ChevronDownIcon,
  CalendarDaysIcon,
  ClipboardDocumentCheckIcon,
  FaceSmileIcon,
  PlusCircleIcon,
  LightBulbIcon, // Untuk Quote
  CheckCircleIcon, // Untuk Tugas Selesai
  AcademicCapIcon, // Untuk Keahlian
  LanguageIcon, // Untuk Bahasa
  TagIcon, // Untuk Filter
} from '@heroicons/react/24/outline';

// --- Data Dummy (Diperbarui & Diperkaya) ---
const profileData = {
  name: "Dr. Zulfahmi",
  fullName: "Dr. Faza Zulfahmi Ramadhan",
  specialization: "Dokter Umum",
  nik: "3210011708850001",
  birthPlaceDate: "Bandung, 17 Agustus 1985",
  gender: "Laki-laki",
  religion: "Islam",
  email: "dr.faza.z@klinikmedika.co.id",
  phone: "0812-3456-7890",
  address: "Jl. Sehat Selalu No. 1, Kel. Bahagia, Kec. Sentosa, Kota Sehat 10110",
  fktpName: "Klinik Medika Utama",
  fktpAddress: "Jl. Utama No. 10, Kota Sehat",
  workArea: "Kota Sehat & Sekitarnya",
  strNo: "STR123XYZ/001",
  sipNo: "SIP456ABC/002",
  lastUpdated: "Jumat, 31 Mei 2025", // Menggunakan format tanggal yang sama dengan currentDate
  imageUrl: "[https://via.placeholder.com/150/A0D0D5/1A0A3B?Text=Dr.Z](https://via.placeholder.com/150/A0D0D5/1A0A3B?Text=Dr.Z)",
  skills: ["Penanganan Gawat Darurat", "USG Dasar", "Manajemen Pasien Kronis", "Konseling Kesehatan"],
  languages: ["Bahasa Indonesia (Native)", "English (Professional Working Proficiency)"],
};

const quotes = [
  "Satu-satunya cara untuk melakukan pekerjaan hebat adalah dengan mencintai apa yang Anda lakukan. - Steve Jobs",
  "Kesehatan adalah kekayaan yang sebenarnya. - Mahatma Gandhi",
  "Dedikasi Anda hari ini adalah harapan pasien esok hari.",
  "Setiap pasien adalah guru, setiap hari adalah pelajaran baru.",
  "Merawat adalah inti dari profesi kita."
];

const initialTrainingModules = [
  { id: 1, title: "Komunikasi Empatik dalam Praktik", subtitle: "Membangun kepercayaan melalui komunikasi.", icon: UserCircleIcon, category: "Soft Skills", duration: "3 Jam" },
  { id: 2, title: "Manajemen Stres & Burnout Nakes", subtitle: "Strategi menjaga kesejahteraan mental.", icon: FaceSmileIcon, category: "Kesejahteraan", duration: "2 Jam" },
  { id: 3, title: "Update Pedoman Tatalaksana Diabetes Mellitus", subtitle: "Panduan terbaru untuk praktik terbaik.", icon: ClipboardDocumentCheckIcon, category: "Klinis", duration: "4 Jam" },
  { id: 4, title: "Dasar-Dasar Elektrokardiogram (EKG)", subtitle: "Interpretasi EKG untuk diagnosis awal.", icon: AcademicCapIcon, category: "Klinis", duration: "5 Jam" },
  { id: 5, title: "Teknik Resusitasi Jantung Paru (RJP) Terbaru", subtitle: "Update BLS & ALS sesuai AHA Guideline.", icon: ClipboardDocumentCheckIcon, category: "Kedaruratan", duration: "6 Jam" },
  { id: 6, title: "Etika dan Hukum dalam Praktik Kedokteran", subtitle: "Memahami batasan dan tanggung jawab.", icon: UserCircleIcon, category: "Regulasi", duration: "3 Jam" },
  { id: 7, title: "Penggunaan Sistem Informasi Kesehatan", subtitle: "Optimalisasi rekam medis elektronik.", icon: MagnifyingGlassIcon, category: "Manajemen", duration: "2 Jam"},
];

const initialQuickStatsData = (completedToday: number) => [
  { id: 1, label: "Pasien Terjadwal Hari Ini", value: "8", icon: CalendarDaysIcon, color: "text-[#A0D0D5]" },
  { id: 2, label: "Tugas Selesai Hari Ini", value: `${completedToday}/10`, icon: CheckCircleIcon, color: "text-[#E0F2F3]" },
  { id: 3, label: "Modul Prioritas Belum Selesai", value: "2", icon: PlayCircleIcon, color: "text-[#A0D0D5]" },
];

const initialScheduleData = [
  { id: 1, time: "08:00 - 09:00", title: "Persiapan & Review Rekam Medis Pasien", type: "Persiapan", priority: "penting", status: "normal" },
  { id: 2, time: "09:00 - 10:00", title: "Konsultasi Tn. Agus Setiawan", type: "Konsultasi", priority: "normal", status: "normal" },
  { id: 3, time: "10:00 - 10:30", title: "Telekonsultasi Ny. Budiarti", type: "Telemedisin", priority: "normal", status: "selesai" },
  { id: 4, time: "10:30 - 11:00", title: "Rapat Tim Medis Mingguan", type: "Rapat", priority: "penting", status: "normal" },
  { id: 5, time: "11:00 - 12:00", title: "Visite Pasien Ruang Mawar (Bed 1-5)", type: "Visite", priority: "penting", status: "normal" },
  { id: 6, time: "13:00 - 15:00", title: "Praktik Poli Umum", type: "Praktik", priority: "normal", status: "normal" },
  { id: 7, time: "15:00 - 15:30", title: "Follow-up Pasien Diabetes", type: "Follow-up", priority: "normal", status: "selesai" },
  { id: 8, time: "15:30 - 16:30", title: "Administrasi & Laporan Harian", type: "Administrasi", priority: "rendah", status: "normal" },
  { id: 9, time: "16:30 - 17:00", title: "Penyuluhan Kesehatan Komunitas (Online)", type: "Penyuluhan", priority: "penting", status: "selesai"},
];
// --- End Data Dummy ---

interface FadeInUpProps { children: React.ReactNode; delay?: string; duration?: string; className?: string; }
const FadeInUp: React.FC<FadeInUpProps> = ({ children, delay = '', duration = 'duration-700', className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);
  return (
    <div className={`transition-all ease-out ${duration} ${delay} ${className} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      {children}
    </div>
  );
};

const FloatingParticles: React.FC = () => (
  <div className="absolute inset-0 overflow-hidden -z-10">
    {[...Array(15)].map((_, i) => (
      <div
        key={i}
        className="absolute bg-[#A0D0D5]/20 rounded-full animate-pulse-slower" // Pastikan 'animate-pulse-slower' ada di tailwind.config.js
        style={{
          width: `${Math.random() * 3 + 1}rem`, height: `${Math.random() * 3 + 1}rem`,
          left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 5}s`, animationDuration: `${Math.random() * 10 + 10}s`,
        }}
      />
    ))}
  </div>
);

const DashboardNakesPage: React.FC = () => {
  const [currentQuote, setCurrentQuote] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [scheduleFilter, setScheduleFilter] = useState('semua');
  const [moduleCategoryFilter, setModuleCategoryFilter] = useState('semua');
  const [searchTerm, setSearchTerm] = useState(''); // Untuk search modul

  useEffect(() => {
    setCurrentQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    const today = new Date();
    setCurrentDate(today.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
    
    // Update 'lastUpdated' profile jika hari ini adalah tanggal yang sama untuk konsistensi
    // Ini hanya untuk demo, di aplikasi nyata data ini datang dari backend
    if (profileData.lastUpdated !== `${today.toLocaleDateString('id-ID', { weekday: 'long' })}, ${today.getDate()} ${today.toLocaleDateString('id-ID', { month: 'long' })} ${today.getFullYear()}`) {
        // profileData.lastUpdated = `${today.toLocaleDateString('id-ID', { weekday: 'long' })}, ${today.getDate()} ${today.toLocaleDateString('id-ID', { month: 'long' })} ${today.getFullYear()}`;
        // Sebaiknya tidak memutasi objek langsung seperti ini, tapi karena ini data dummy, untuk demo saja
    }

  }, []);
  
  const completedTasksToday = useMemo(() => initialScheduleData.filter(item => item.status === 'selesai').length, []);
  const quickStatsData = useMemo(() => initialQuickStatsData(completedTasksToday), [completedTasksToday]);

  const filteredSchedule = useMemo(() => {
    if (scheduleFilter === 'penting') return initialScheduleData.filter(item => item.priority === 'penting' && item.status !== 'selesai');
    if (scheduleFilter === 'selesai') return initialScheduleData.filter(item => item.status === 'selesai');
    // Default: tampilkan semua yang belum selesai, urutkan yang penting di atas
    return initialScheduleData
      .filter(item => item.status !== 'selesai')
      .sort((a, b) => (a.priority === 'penting' ? -1 : 1) - (b.priority === 'penting' ? -1 : 1));
  }, [scheduleFilter]);
  
  const scheduleDisplayData = scheduleFilter === 'semua' 
    ? initialScheduleData.sort((a,b) => (a.status === 'selesai' ? 1 : -1) - (b.status === 'selesai' ? 1 : -1) || (a.priority === 'penting' ? -1 : 1) - (b.priority === 'penting' ? -1 : 1)) 
    : filteredSchedule;

  const trainingModuleCategories = useMemo(() => {
    const categories = new Set(initialTrainingModules.map(module => module.category));
    return ['semua', ...Array.from(categories)];
  }, []);

  const filteredTrainingModules = useMemo(() => {
    let modules = initialTrainingModules;
    if (moduleCategoryFilter !== 'semua') {
      modules = modules.filter(module => module.category === moduleCategoryFilter);
    }
    if (searchTerm) {
      modules = modules.filter(module => 
        module.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        module.subtitle.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return modules;
  }, [moduleCategoryFilter, searchTerm]);

  return (
    <>
      <Navbar /> {/* Pastikan path Navbar sudah benar */}
      
      {/* === Bagian 1: Hero Greeting & Statistik Cepat === */}
      <section className="min-h-screen h-auto flex flex-col items-center justify-center bg-gradient-to-br from-[#1A0A3B] via-[#1E47A0] to-[#1A0A3B] text-[#E0F2F3] text-center p-6 relative overflow-hidden">
        <FloatingParticles />
        <FadeInUp duration="duration-1000" className="w-full max-w-4xl">
          <p className="text-lg opacity-90 mb-2 text-[#A0D0D5]">{currentDate}</p>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight">
            Halo {profileData.name}
          </h1>
        </FadeInUp>
        <FadeInUp delay="delay-[200ms]" duration="duration-1000" className="w-full max-w-4xl">
          <p className="mt-4 text-xl sm:text-2xl opacity-80">
            Selamat datang kembali! Semoga harimu produktif dan menyenangkan.
          </p>
        </FadeInUp>
        <FadeInUp delay="delay-[400ms]" duration="duration-1000" className="mt-6 italic text-center max-w-2xl mx-auto text-[#A0D0D5]/90">
          <LightBulbIcon className="w-6 h-6 inline-block mr-2 mb-1" />
          &quot;{currentQuote}&quot;
        </FadeInUp>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-3xl w-full">
          {quickStatsData.map((stat, index) => (
            <FadeInUp key={stat.id} delay={`delay-[${500 + index * 100}ms]`} duration="duration-700">
              <div className="bg-white/10 backdrop-blur-md p-5 rounded-xl border border-white/20 shadow-lg text-center h-full flex flex-col justify-center items-center">
                <stat.icon className={`w-10 h-10 mx-auto mb-3 ${stat.color}`} />
                <p className="text-md font-medium text-[#E0F2F3]/80 leading-tight">{stat.label}</p>
                <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
              </div>
            </FadeInUp>
          ))}
        </div>

        <FadeInUp delay="delay-[800ms]" duration="duration-1000">
          <button className="mt-12 bg-[#A0D0D5] text-[#1A0A3B] font-bold py-3.5 px-12 rounded-lg shadow-xl hover:bg-[#E0F2F3] transform hover:scale-105 transition-all duration-300 ease-in-out text-lg focus:outline-none focus:ring-4 focus:ring-[#A0D0D5]/50">
            Isi Log Harian Anda
          </button>
        </FadeInUp>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce opacity-70">
          <ChevronDownIcon className="w-10 h-10 text-[#A0D0D5]" />
        </div>
      </section>

      {/* === Bagian 2: Jadwal Saya === */}
      <section className="min-h-screen h-auto flex flex-col items-center justify-center bg-[#E0F2F3] p-6 sm:p-8" id='Jadwal'>
        <div className="w-full max-w-5xl my-auto">
          <FadeInUp className="text-center">
            <h2 className="text-4xl sm:text-5xl font-bold text-[#1A0A3B] mb-3">Jadwal Anda Hari Ini</h2>
            <p className="text-lg text-[#1E47A0]/80 mb-6">Tetap terorganisir dan fokus pada prioritas Anda.</p>
          </FadeInUp>
          
          <FadeInUp delay="delay-[100ms]" className="mb-6 flex flex-wrap justify-center gap-2 sm:gap-3">
            {(['semua', 'penting', 'selesai'] as const).map(filter => (
              <button
                key={filter}
                onClick={() => setScheduleFilter(filter)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 shadow-sm
                  ${scheduleFilter === filter 
                    ? 'bg-[#1A0A3B] text-white ring-2 ring-[#1E47A0]' 
                    : 'bg-white/70 text-[#1E47A0] hover:bg-[#A0D0D5]/50 hover:text-[#1A0A3B]'}`}
              >
                {filter === 'semua' ? 'Semua Agenda' : filter === 'penting' ? 'Prioritas Utama (Aktif)' : 'Sudah Selesai'}
              </button>
            ))}
          </FadeInUp>

          <div className="space-y-4 max-h-[calc(100vh-300px)] sm:max-h-[calc(100vh-280px)] overflow-y-auto pr-2 custom-scrollbar">
            {scheduleDisplayData.length > 0 ? scheduleDisplayData.map((item, index) => (
              <FadeInUp key={item.id} delay={`delay-[${index * 50 + 200}ms]`} duration="duration-500">
                <div className={`flex items-center space-x-4 p-4 rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl relative
                  ${item.status === 'selesai' ? 'bg-gray-300/70 opacity-70' : item.priority === 'penting' ? 'bg-gradient-to-r from-[#A0D0D5]/80 to-[#E0F2F3]/90 border-l-4 border-[#1E47A0]' : 'bg-white/80 backdrop-blur-md border border-white/50'}`}>
                  {item.status === 'selesai' && <div className="absolute inset-0 bg-black/5 rounded-xl pointer-events-none"></div>}
                  <div className={`p-2.5 rounded-full ${item.status === 'selesai' ? 'bg-gray-400/50' : item.priority === 'penting' ? 'bg-[#1E47A0]/20' : 'bg-[#A0D0D5]/30'}`}>
                    <CalendarDaysIcon className={`w-7 h-7 ${item.status === 'selesai' ? 'text-gray-600' : item.priority === 'penting' ? 'text-[#1E47A0]' : 'text-[#1A0A3B]/70'}`} />
                  </div>
                  <div className="flex-grow">
                    <p className={`text-sm font-medium ${item.status === 'selesai' ? 'text-gray-600 line-through' : 'text-[#1E47A0]/90'}`}>{item.time}</p>
                    <h3 className={`text-md font-semibold ${item.status === 'selesai' ? 'text-gray-700 line-through' : 'text-[#1A0A3B]'}`}>{item.title}</h3>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full
                    ${item.status === 'selesai' ? 'bg-gray-500 text-white' : item.priority === 'penting' ? 'bg-[#1E47A0] text-white' : 'bg-[#A0D0D5]/50 text-[#1A0A3B]'}`}>
                    {item.type}
                  </span>
                </div>
              </FadeInUp>
            )) : (
              <FadeInUp delay="delay-[200ms]">
                <p className="text-center text-gray-500 py-10 text-lg">Tidak ada jadwal yang sesuai dengan filter &quot;{scheduleFilter}&quot;.</p>
              </FadeInUp>
            )}
          </div>
          <FadeInUp delay="delay-[500ms]" className="text-center mt-8">
            <button className="bg-[#1E47A0] text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:bg-[#1A0A3B] transform hover:scale-105 transition-all duration-300 ease-in-out flex items-center mx-auto">
              <PlusCircleIcon className="w-5 h-5 mr-2" />
              Tambah Agenda Baru
            </button>
          </FadeInUp>
        </div>
      </section>

      {/* === Bagian 3: Preview Profil === */}
      <section className="min-h-screen h-auto flex flex-col items-center justify-center bg-[#A0D0D5] p-6 sm:p-8" id='Profil'>
        <FadeInUp className="w-full max-w-4xl my-auto">
          <div className="bg-clip-padding backdrop-filter backdrop-blur-2xl bg-[#E0F2F3]/80 border border-[#E0F2F3]/50 shadow-2xl rounded-3xl overflow-hidden">
            <div className="p-6 sm:p-10">
              <h2 className="text-4xl sm:text-5xl font-bold text-[#1A0A3B] mb-10 text-center">
                Profil Saya
              </h2>
              <div className="md:grid md:grid-cols-3 md:gap-x-8 items-start">
                <div className="md:col-span-1 text-center md:text-left mb-8 md:mb-0 flex flex-col items-center md:items-start">
                  <img src={profileData.imageUrl} alt={`Foto ${profileData.fullName}`}
                    className="w-40 h-40 sm:w-48 sm:h-48 rounded-full object-cover shadow-2xl border-4 border-[#E0F2F3] ring-2 ring-[#1E47A0]/50 transform transition-all duration-500 hover:scale-110 hover:rotate-3"
                  />
                  <button className="mt-6 text-sm flex items-center text-[#1E47A0] hover:text-[#1A0A3B] font-semibold transition group">
                    <PencilSquareIcon className="w-5 h-5 mr-1.5 transition-transform duration-300 group-hover:rotate-[-10deg]" />
                    Perbarui Profil
                  </button>
                  <p className="mt-3 text-xs text-[#1A0A3B]/70 text-center md:text-left">
                    Terakhir Diperbaharui: {profileData.lastUpdated}
                  </p>
                </div>
                <div className="md:col-span-2 space-y-2 text-sm text-[#1A0A3B]/90">
                  <h3 className="text-2xl sm:text-3xl font-bold text-[#1A0A3B] mb-4">{profileData.fullName}</h3>
                  {[
                    { label: "Spesialisasi", value: profileData.specialization },
                    { label: "NIK", value: profileData.nik },
                    { label: "TTL", value: profileData.birthPlaceDate },
                    { label: "Gender", value: profileData.gender },
                    { label: "Email", value: profileData.email },
                    { label: "Telepon", value: profileData.phone },
                    { label: "Alamat", value: profileData.address, fullWidth: true },
                    { label: "No. STR", value: profileData.strNo },
                    { label: "No. SIP", value: profileData.sipNo },
                    { label: "Area Kerja", value: profileData.workArea },
                    { label: "FKTP", value: `${profileData.fktpName}, ${profileData.fktpAddress}` },
                  ].map(item => (
                    <p key={item.label} className={item.fullWidth ? "col-span-2" : ""}>
                      <span className="font-bold text-[#1E47A0] w-28 sm:w-36 inline-block">{item.label}:</span> {item.value}
                    </p>
                  ))}
                  
                  <div className="pt-4 mt-4 border-t border-[#1E47A0]/20">
                    <h4 className="text-lg font-semibold text-[#1A0A3B] mb-2 flex items-center"><AcademicCapIcon className="w-5 h-5 mr-2 text-[#1E47A0]"/>Keahlian Utama</h4>
                    <ul className="list-disc list-inside ml-1 space-y-1">
                      {profileData.skills.map(skill => <li key={skill}>{skill}</li>)}
                    </ul>
                  </div>
                   <div className="pt-3 mt-3 border-t border-[#1E47A0]/20">
                    <h4 className="text-lg font-semibold text-[#1A0A3B] mb-2 flex items-center"><LanguageIcon className="w-5 h-5 mr-2 text-[#1E47A0]"/>Bahasa</h4>
                    <ul className="list-disc list-inside ml-1 space-y-1">
                      {profileData.languages.map(lang => <li key={lang}>{lang}</li>)}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </FadeInUp>
      </section>

      {/* === Bagian 4: Pusat Pelatihan === */}
      <section className="min-h-screen h-auto flex flex-col items-center bg-[#1E47A0] p-6 sm:p-8 pt-10 sm:pt-12 md:pt-16" id='Pelatihan'>
        <div className="w-full max-w-6xl z-10">
          <FadeInUp>
            <h2 className="text-4xl sm:text-5xl font-bold text-[#E0F2F3] text-center mb-3">Pusat Pelatihan</h2>
          </FadeInUp>
          <FadeInUp delay="delay-[150ms]">
            <p className="text-[#A0D0D5]/90 text-center mb-6 max-w-2xl mx-auto text-lg">
              Asah terus kompetensi Anda dengan modul pilihan terbaik ({filteredTrainingModules.length} modul tersedia).
            </p>
          </FadeInUp>

          <FadeInUp delay="delay-[250ms]" className="mb-8 flex flex-col items-center">
            <div className="relative flex items-center shadow-xl rounded-full w-full max-w-xl mb-4">
              <input 
                type="search" 
                placeholder="Cari modul berdasarkan judul atau deskripsi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-4 px-7 pr-16 rounded-full border-2 border-transparent bg-[#E0F2F3]/90 backdrop-blur-md focus:ring-4 focus:ring-[#A0D0D5]/80 focus:border-[#A0D0D5] text-[#1A0A3B] placeholder-[#1E47A0]/70 transition-all duration-300"
              />
              <button 
                type="button" // Tambahkan type="button" untuk mencegah submit form jika ada
                className="absolute right-2.5 top-1/2 -translate-y-1/2 bg-gradient-to-r from-[#1A0A3B] to-[#1E47A0] text-white p-2.5 rounded-full hover:from-[#1E47A0] hover:to-[#1A0A3B] focus:outline-none transition-all duration-300 transform hover:scale-110 shadow-lg"
                onClick={() => setSearchTerm('')} // Contoh: tombol bisa untuk clear search
              >
                <MagnifyingGlassIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
              {trainingModuleCategories.map(category => (
                <button key={category} onClick={() => setModuleCategoryFilter(category)}
                  className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-full transition-all duration-200 border-2
                  ${moduleCategoryFilter === category 
                    ? 'bg-[#A0D0D5] text-[#1A0A3B] border-[#A0D0D5]' 
                    : 'bg-transparent text-[#A0D0D5] border-[#A0D0D5]/50 hover:bg-[#A0D0D5]/30 hover:text-white'}`}
                >
                  <TagIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1 inline-block"/>{category === 'semua' ? 'Semua Kategori' : category}
                </button>
              ))}
            </div>
          </FadeInUp>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 pb-16">
            {filteredTrainingModules.length > 0 ? filteredTrainingModules.map((module, index) => (
              <FadeInUp key={module.id} delay={`delay-[${index * 100 + 300}ms]`}>
                <div className="bg-clip-padding backdrop-filter backdrop-blur-lg bg-[#A0D0D5]/30 border border-[#A0D0D5]/40 rounded-2xl shadow-xl p-6 flex flex-col h-full hover:shadow-[#A0D0D5]/30 transition-all duration-300 transform hover:-translate-y-2 group">
                  <div className="flex-grow mb-4">
                    <div className="flex justify-between items-start mb-2">
                        <module.icon className="w-10 h-10 text-[#E0F2F3]/80 group-hover:text-[#E0F2F3] transition-colors"/>
                        <span className="text-xs bg-[#1A0A3B]/50 text-[#A0D0D5] px-2 py-0.5 rounded-full">{module.category}</span>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-1.5 line-clamp-2 group-hover:text-[#E0F2F3] transition-colors">{module.title}</h3>
                    <p className="text-sm text-[#E0F2F3]/80 mb-3 line-clamp-3">{module.subtitle}</p>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-xs text-[#E0F2F3]/70">Durasi: {module.duration}</p>
                    {/* Placeholder untuk progres atau status modul */}
                    <span className="text-xs text-[#1A0A3B] bg-[#A0D0D5]/70 px-2 py-0.5 rounded-full">Baru</span>
                  </div>
                  <button className="w-full bg-gradient-to-r from-[#A0D0D5] to-[#E0F2F3] text-[#1A0A3B] font-bold py-3 px-4 rounded-lg hover:from-[#E0F2F3] hover:to-[#A0D0D5] focus:outline-none focus:ring-4 focus:ring-[#A0D0D5]/50 transition-all duration-300 transform group-hover:scale-105 flex items-center justify-center shadow-md">
                    <PlayCircleIcon className="w-6 h-6 mr-2" />
                    Mulai Belajar
                  </button>
                </div>
              </FadeInUp>
            )) : (
              <FadeInUp delay="delay-[200ms]" className="md:col-span-2 lg:col-span-3">
                <p className="text-center text-[#A0D0D5]/80 py-20 text-xl">
                  Tidak ada modul pelatihan yang cocok dengan pencarian &quot;{searchTerm}&quot;
                  {moduleCategoryFilter !== 'semua' && ` dalam kategori "${moduleCategoryFilter}"`}.
                </p>
              </FadeInUp>
            )}
          </div>
        </div>
      </section>
      <Footer /> {/* Pastikan path Footer sudah benar */}
    </>
  );
};

export default DashboardNakesPage;
