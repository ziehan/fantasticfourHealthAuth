// app/dashboard-nakes/page.tsx
"use client";

// Asumsi folder 'sections' ada di 'app/sections/'
// Jika 'sections' ada di root proyek, gunakan '../../../sections/navbar'
import Navbar from './sections/navbar';
import Footer from './sections/footer';

import React, { useEffect, useState, useMemo, FormEvent, ChangeEvent } from 'react';
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
  LightBulbIcon,
  CheckCircleIcon,
  AcademicCapIcon,
  LanguageIcon,
  TagIcon,
  XMarkIcon,
  InformationCircleIcon,      // Ditambahkan untuk modal asisten (pengganti Info dari lucide)
  ChatBubbleLeftEllipsisIcon, // Ditambahkan untuk FAB dan modal asisten
} from '@heroicons/react/24/outline';

// Impor Chatbox Anda - PASTIKAN PATH INI BENAR
import Chatbox from '@/components/chatbox'; // Sesuaikan path jika berbeda

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
  lastUpdated: "Jumat, 31 Mei 2025",
  imageUrl: "https://via.placeholder.com/150/A0D0D5/1A0A3B?Text=Dr.Z",
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

interface ScheduleItem {
  id: number;
  time: string;
  title: string;
  type: string;
  priority: 'penting' | 'normal' | 'rendah';
  status: 'normal' | 'selesai' | 'dibatalkan';
}

interface TrainingModule {
  id: number;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  category: string;
  duration: string;
  status: 'Baru' | 'Dimulai' | 'Selesai';
}

interface ProfileDetailItem {
  label: string;
  value: string;
  fullWidth?: boolean; // Properti ini opsional
}


const initialTrainingModulesData: Omit<TrainingModule, 'status'>[] = [
  { id: 1, title: "Komunikasi Empatik dalam Praktik", subtitle: "Membangun kepercayaan melalui komunikasi.", icon: UserCircleIcon, category: "Soft Skills", duration: "3 Jam" },
  { id: 2, title: "Manajemen Stres & Burnout Nakes", subtitle: "Strategi menjaga kesejahteraan mental.", icon: FaceSmileIcon, category: "Kesejahteraan", duration: "2 Jam" },
  { id: 3, title: "Update Pedoman Tatalaksana Diabetes Mellitus", subtitle: "Panduan terbaru untuk praktik terbaik.", icon: ClipboardDocumentCheckIcon, category: "Klinis", duration: "4 Jam" },
  // ... modul lainnya
];

const initialQuickStatsData = (completedToday: number, totalScheduled: number, priorityModules: number) => [
  { id: 1, label: "Pasien Terjadwal Hari Ini", value: `${totalScheduled}`, icon: CalendarDaysIcon, color: "text-[#A0D0D5]" },
  { id: 2, label: "Tugas Selesai Hari Ini", value: `${completedToday}/${totalScheduled > 0 ? totalScheduled : '-'}`, icon: CheckCircleIcon, color: "text-[#E0F2F3]" },
  { id: 3, label: "Modul Prioritas Belum Selesai", value: `${priorityModules}`, icon: PlayCircleIcon, color: "text-[#A0D0D5]" },
];

const initialScheduleData: ScheduleItem[] = [
  { id: 1, time: "08:00 - 09:00", title: "Persiapan & Review Rekam Medis Pasien", type: "Persiapan", priority: "penting", status: "normal" },
  { id: 2, time: "09:00 - 10:00", title: "Konsultasi Tn. Agus Setiawan", type: "Konsultasi", priority: "normal", status: "normal" },
  { id: 3, time: "10:00 - 10:30", title: "Telekonsultasi Ny. Budiarti", type: "Telemedisin", priority: "normal", status: "selesai" },
  // ... agenda lainnya
];

interface FadeInUpProps {
  children: React.ReactNode;
  delay?: string;
  duration?: string;
  className?: string;
  style?: React.CSSProperties; // <--- Tambahkan baris ini
}

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
        className="absolute bg-[#A0D0D5]/20 rounded-full animate-pulse-slower"
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

  const [scheduleData, setScheduleData] = useState<ScheduleItem[]>(initialScheduleData);
  const [trainingModules, setTrainingModules] = useState<TrainingModule[]>(
    initialTrainingModulesData.map(module => ({ ...module, status: 'Baru' }))
  );

  const [scheduleFilter, setScheduleFilter] = useState<'semua' | 'penting' | 'selesai'>('semua');
  const [moduleCategoryFilter, setModuleCategoryFilter] = useState('semua');
  const [searchTerm, setSearchTerm] = useState('');

  const [isAgendaModalOpen, setIsAgendaModalOpen] = useState(false);
  const [newAgenda, setNewAgenda] = useState({
    time: '', title: '', type: 'Umum', priority: 'normal' as ScheduleItem['priority'],
  });

  // State untuk modal Asisten AI
  const [isAssistantModalOpen, setIsAssistantModalOpen] = useState(false);


  useEffect(() => {
    setCurrentQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    const today = new Date();
    setCurrentDate(today.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
  }, []);

  const completedTasksToday = useMemo(() => scheduleData.filter(item => item.status === 'selesai').length, [scheduleData]);
  const totalScheduledToday = useMemo(() => scheduleData.filter(item => item.status !== 'dibatalkan').length, [scheduleData]);
  const priorityModulesNotDone = useMemo(() => trainingModules.filter(m => m.status !== 'Selesai').length, [trainingModules]);

  const quickStatsData = useMemo(() => initialQuickStatsData(completedTasksToday, totalScheduledToday, priorityModulesNotDone), [completedTasksToday, totalScheduledToday, priorityModulesNotDone]);

  const filteredSchedule = useMemo(() => {
    const dataToFilter = [...scheduleData];
    if (scheduleFilter === 'penting') return dataToFilter.filter(item => item.priority === 'penting' && item.status !== 'selesai');
    if (scheduleFilter === 'selesai') return dataToFilter.filter(item => item.status === 'selesai');
    return dataToFilter.filter(item => item.status !== 'selesai').sort((a, b) => (a.priority === 'penting' ? -1 : 1) - (b.priority === 'penting' ? -1 : 1));
  }, [scheduleData, scheduleFilter]);

  const scheduleDisplayData = useMemo(() => {
    if (scheduleFilter === 'semua') {
      return [...scheduleData].sort((a, b) => {
        if (a.status === 'selesai' && b.status !== 'selesai') return 1;
        if (a.status !== 'selesai' && b.status === 'selesai') return -1;
        if (a.priority === 'penting' && b.priority !== 'penting') return -1;
        if (a.priority !== 'penting' && b.priority === 'penting') return 1;
        return 0;
      });
    }
    return filteredSchedule;
  }, [scheduleData, scheduleFilter, filteredSchedule]);

  const trainingModuleCategories = useMemo(() => {
    const categories = new Set(trainingModules.map(module => module.category));
    return ['semua', ...Array.from(categories)];
  }, [trainingModules]);

  const filteredTrainingModules = useMemo(() => {
    let modules = [...trainingModules];
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
  }, [trainingModules, moduleCategoryFilter, searchTerm]);

  const handleOpenAgendaModal = () => {
    setNewAgenda({ time: '', title: '', type: 'Umum', priority: 'normal' });
    setIsAgendaModalOpen(true);
  };

  const handleNewAgendaChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewAgenda(prev => ({ ...prev, [name]: value }));
  };

  const handleAddAgenda = (e: FormEvent) => {
    e.preventDefault();
    if (!newAgenda.title.trim() || !newAgenda.time.trim()) {
      alert("Waktu dan Judul Agenda harus diisi!"); return;
    }
    const newId = scheduleData.length > 0 ? Math.max(...scheduleData.map(item => item.id)) + 1 : 1;
    const agendaToAdd: ScheduleItem = {
      id: newId, time: newAgenda.time, title: newAgenda.title, type: newAgenda.type,
      priority: newAgenda.priority as ScheduleItem['priority'], status: 'normal',
    };
    setScheduleData(prevSchedule => [agendaToAdd, ...prevSchedule]);
    setIsAgendaModalOpen(false);
  };

  const handleStartLearning = (moduleId: number) => {
    setTrainingModules(prevModules =>
      prevModules.map(module => module.id === moduleId ? { ...module, status: 'Dimulai' } : module)
    );
    const moduleTitle = trainingModules.find(m => m.id === moduleId)?.title;
    alert(`Memulai modul: "${moduleTitle}"`);
  };

  const handleToggleAgendaStatus = (agendaId: number) => {
    setScheduleData(prevSchedule =>
      prevSchedule.map(item => item.id === agendaId ? { ...item, status: item.status === 'selesai' ? 'normal' : 'selesai' } : item)
    );
  };

  // Handler untuk modal Asisten AI
  const handleOpenAssistantModal = () => setIsAssistantModalOpen(true);
  const handleCloseAssistantModal = () => setIsAssistantModalOpen(false);

  const agendaTypes = ["Persiapan", "Konsultasi", "Telemedisin", "Rapat", "Visite", "Praktik", "Follow-up", "Administrasi", "Penyuluhan", "Umum"];
  const agendaPriorities: { value: ScheduleItem['priority']; label: string }[] = [
    { value: 'penting', label: 'Penting' }, { value: 'normal', label: 'Normal' }, { value: 'rendah', label: 'Rendah' },
  ];

  return (
    <div className="flex flex-col min-h-screen"> {/* Wrapper utama untuk menjaga FAB di atas footer */}
      <Navbar />

      {/* Konten Utama Dashboard */}
      <main className="flex-grow"> {/* flex-grow agar main content mengisi ruang */}
        {/* === Bagian 1: Hero Greeting & Statistik Cepat === */}
        <section className="min-h-screen h-auto flex flex-col items-center justify-center bg-gradient-to-br from-[#1A0A3B] via-[#1E47A0] to-[#1A0A3B] text-[#E0F2F3] text-center p-6 relative overflow-hidden">
          {/* ... (konten hero section tidak berubah signifikan) ... */}
          <FloatingParticles />
          <FadeInUp duration="duration-1000" className="w-full max-w-4xl">
            <p className="text-lg opacity-90 mb-2 text-[#A0D0D5]">{currentDate}</p>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight">
              Halo Dokter!
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
            <button
              className="mt-12 bg-[#A0D0D5] text-[#1A0A3B] font-bold py-3.5 px-12 rounded-lg shadow-xl hover:bg-[#E0F2F3] transform hover:scale-105 transition-all duration-300 ease-in-out text-lg focus:outline-none focus:ring-4 focus:ring-[#A0D0D5]/50"
              onClick={() => window.location.href = "./dashboard-nakes/kuesioner"}
            >
              Isi Log Harian Anda
            </button>
          </FadeInUp>
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce opacity-70">
            <ChevronDownIcon className="w-10 h-10 text-[#A0D0D5]" />
          </div>
        </section>

        {/* === Bagian 2: Jadwal Saya === */}
        <section className="min-h-screen h-auto flex flex-col items-center justify-center bg-[#E0F2F3] p-6 sm:p-8" id='Jadwal'>
          {/* ... (konten jadwal tidak berubah signifikan) ... */}
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
                  {filter === 'semua' ? 'Semua Agenda (Aktif & Selesai)' : filter === 'penting' ? 'Prioritas Utama (Aktif)' : 'Sudah Selesai'}
                </button>
              ))}
            </FadeInUp>

            <div className="space-y-4 max-h-[calc(100vh-300px)] sm:max-h-[calc(100vh-280px)] overflow-y-auto pr-2 custom-scrollbar">
              {scheduleDisplayData.length > 0 ? scheduleDisplayData.map((item, index) => (
                <FadeInUp key={item.id} delay={`delay-[${index * 50 + 200}ms]`} duration="duration-500">
                  <div
                    className={`flex items-center space-x-4 p-4 rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl relative cursor-pointer group
                        ${item.status === 'selesai' ? 'bg-gray-300/70 opacity-70' : item.priority === 'penting' ? 'bg-gradient-to-r from-[#A0D0D5]/80 to-[#E0F2F3]/90 border-l-4 border-[#1E47A0]' : 'bg-white/80 backdrop-blur-md border border-white/50'}`}
                    onClick={() => handleToggleAgendaStatus(item.id)}
                  >
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
                    {item.status !== 'selesai' && (
                      <CheckCircleIcon className="w-6 h-6 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ml-2" title="Tandai Selesai" />
                    )}
                    {item.status === 'selesai' && (
                      <ClipboardDocumentCheckIcon className="w-6 h-6 text-gray-600 ml-2" title="Sudah Selesai" />
                    )}
                  </div>
                </FadeInUp>
              )) : (
                <FadeInUp delay="delay-[200ms]">
                  <p className="text-center text-gray-500 py-10 text-lg">Tidak ada jadwal yang sesuai dengan filter &quot;{scheduleFilter}&quot;.</p>
                </FadeInUp>
              )}
            </div>
            <FadeInUp delay="delay-[500ms]" className="text-center mt-8">
              <button
                onClick={handleOpenAgendaModal}
                className="bg-[#1E47A0] text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:bg-[#1A0A3B] transform hover:scale-105 transition-all duration-300 ease-in-out flex items-center mx-auto"
              >
                <PlusCircleIcon className="w-5 h-5 mr-2" />
                Tambah Agenda Baru
              </button>
            </FadeInUp>
          </div>
        </section>

        {/* === Bagian 3: Preview Profil === */}
        <section className="min-h-screen h-auto flex flex-col items-center justify-center bg-[#A0D0D5] p-6 sm:p-8" id='Profil'>
          {/* ... (konten profil tidak berubah signifikan) ... */}
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
                    {(
                      [ // Tambahkan kurung dan anotasi tipe di sini
                        { label: "Spesialisasi", value: profileData.specialization },
                        { label: "NIK", value: profileData.nik },
                        { label: "TTL", value: profileData.birthPlaceDate },
                        { label: "Jenis Kelamin", value: profileData.gender }, // Tambahkan ini jika belum ada
                        { label: "Agama", value: profileData.religion },
                        { label: "Email", value: profileData.email },
                        { label: "No. Telepon", value: profileData.phone },
                        { label: "No. STR", value: profileData.strNo },
                        { label: "No. SIP", value: profileData.sipNo },
                        { label: "Area Kerja", value: profileData.workArea },
                        { label: "Alamat", value: profileData.address, fullWidth: true }, // Di sini properti fullWidth ada
                        { label: "FKTP", value: `${profileData.fktpName}, ${profileData.fktpAddress}` },
                      ] as ProfileDetailItem[] // <--- Anotasi tipe di sini
                    ).map(item => (
                      <p key={item.label} className={item.fullWidth ? "md:col-span-2" : ""}> {/* Menggunakan md:col-span-2 agar menyesuaikan grid */}
                        <span className="font-bold text-[#1E47A0] w-28 sm:w-36 inline-block">{item.label}:</span> {item.value}
                      </p>
                    ))}

                    <div className="pt-4 mt-4 border-t border-[#1E47A0]/20">
                      <h4 className="text-lg font-semibold text-[#1A0A3B] mb-2 flex items-center"><AcademicCapIcon className="w-5 h-5 mr-2 text-[#1E47A0]" />Keahlian Utama</h4>
                      <ul className="list-disc list-inside ml-1 space-y-1">
                        {profileData.skills.map(skill => <li key={skill}>{skill}</li>)}
                      </ul>
                    </div>
                    <div className="pt-3 mt-3 border-t border-[#1E47A0]/20">
                      <h4 className="text-lg font-semibold text-[#1A0A3B] mb-2 flex items-center"><LanguageIcon className="w-5 h-5 mr-2 text-[#1E47A0]" />Bahasa</h4>
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
          {/* ... (konten pelatihan tidak berubah signifikan) ... */}
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
                  type="button"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 bg-gradient-to-r from-[#1A0A3B] to-[#1E47A0] text-white p-2.5 rounded-full hover:from-[#1E47A0] hover:to-[#1A0A3B] focus:outline-none transition-all duration-300 transform hover:scale-110 shadow-lg"
                  onClick={() => setSearchTerm('')}
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
                    <TagIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1 inline-block" />{category === 'semua' ? 'Semua Kategori' : category}
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
                        <module.icon className="w-10 h-10 text-[#E0F2F3]/80 group-hover:text-[#E0F2F3] transition-colors" />
                        <span className="text-xs bg-[#1A0A3B]/50 text-[#A0D0D5] px-2 py-0.5 rounded-full">{module.category}</span>
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-1.5 line-clamp-2 group-hover:text-[#E0F2F3] transition-colors">{module.title}</h3>
                      <p className="text-sm text-[#E0F2F3]/80 mb-3 line-clamp-3">{module.subtitle}</p>
                    </div>
                    <div className="flex justify-between items-center mb-4">
                      <p className="text-xs text-[#E0F2F3]/70">Durasi: {module.duration}</p>
                      <span className={`text-xs text-[#1A0A3B] px-2 py-0.5 rounded-full
                        ${module.status === 'Dimulai' ? 'bg-yellow-300/80' : module.status === 'Selesai' ? 'bg-green-400/80' : 'bg-[#A0D0D5]/70'}`}>
                        {module.status}
                      </span>
                    </div>
                    <button
                      onClick={() => handleStartLearning(module.id)}
                      disabled={module.status === 'Dimulai' || module.status === 'Selesai'}
                      className={`w-full bg-gradient-to-r text-[#1A0A3B] font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-4 focus:ring-[#A0D0D5]/50 transition-all duration-300 transform group-hover:scale-105 flex items-center justify-center shadow-md
                        ${module.status === 'Dimulai' || module.status === 'Selesai'
                          ? 'from-gray-400 to-gray-500 cursor-not-allowed opacity-70'
                          : 'from-[#A0D0D5] to-[#E0F2F3] hover:from-[#E0F2F3] hover:to-[#A0D0D5]'}`}
                    >
                      <PlayCircleIcon className="w-6 h-6 mr-2" />
                      {module.status === 'Baru' ? 'Mulai Belajar' : module.status === 'Dimulai' ? 'Sedang Dipelajari' : 'Modul Selesai'}
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
      </main>

      <Footer />

      {/* Floating Action Button (FAB) untuk Asisten AI */}
      <button
        onClick={handleOpenAssistantModal}
        title="Buka Asisten AI"
        className="fixed bottom-20 right-8 bg-gradient-to-r from-[#1E47A0] to-[#123A7A] text-white p-4 rounded-full shadow-xl hover:from-[#123A7A] hover:to-[#1E47A0] transform hover:scale-110 transition-all duration-300 ease-in-out z-40"
      >
        <ChatBubbleLeftEllipsisIcon className="w-7 h-7" />
      </button>

      {/* Modal untuk Tambah Agenda Baru */}
      {isAgendaModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          {/* ... (konten modal tambah agenda tidak berubah) ... */}
          <FadeInUp duration="duration-300" className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-[#1A0A3B]">Tambah Agenda Baru</h3>
                <button onClick={() => setIsAgendaModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <XMarkIcon className="w-7 h-7" />
                </button>
              </div>
              <form onSubmit={handleAddAgenda} className="space-y-4">
                <div>
                  <label htmlFor="time" className="block text-sm font-medium text-[#1E47A0]">Waktu (cth: 09:00 - 10:00)</label>
                  <input type="text" name="time" id="time" value={newAgenda.time} onChange={handleNewAgendaChange} required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#1E47A0] focus:border-[#1E47A0] sm:text-sm text-[#1A0A3B]" />
                </div>
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-[#1E47A0]">Judul Agenda</label>
                  <input type="text" name="title" id="title" value={newAgenda.title} onChange={handleNewAgendaChange} required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#1E47A0] focus:border-[#1E47A0] sm:text-sm text-[#1A0A3B]" />
                </div>
                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-[#1E47A0]">Jenis Agenda</label>
                  <select name="type" id="type" value={newAgenda.type} onChange={handleNewAgendaChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-[#1E47A0] focus:border-[#1E47A0] sm:text-sm text-[#1A0A3B]">
                    {agendaTypes.map(type => <option key={type} value={type}>{type}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="priority" className="block text-sm font-medium text-[#1E47A0]">Prioritas</label>
                  <select name="priority" id="priority" value={newAgenda.priority} onChange={handleNewAgendaChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-[#1E47A0] focus:border-[#1E47A0] sm:text-sm text-[#1A0A3B]">
                    {agendaPriorities.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                  </select>
                </div>
                <div className="pt-2 flex justify-end space-x-3">
                  <button type="button" onClick={() => setIsAgendaModalOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                    Batal
                  </button>
                  <button type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-[#1E47A0] rounded-md hover:bg-[#1A0A3B] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1E47A0]">
                    Simpan Agenda
                  </button>
                </div>
              </form>
            </div>
          </FadeInUp>
        </div>
      )}

      {/* Modal untuk Asisten AI */}
      {isAssistantModalOpen && (
        <div className="fixed inset-0 bg-[#1A0A3B]/80 backdrop-blur-lg flex items-center justify-center z-[60] p-4"> {/* Warna backdrop disesuaikan */}
          <FadeInUp duration="duration-300" className="bg-white rounded-xl shadow-2xl w-full max-w-2xl flex flex-col" style={{ maxHeight: 'calc(100vh - 4rem)', height: '700px' }}>
            {/* Header Modal Asisten */}
            <div className="flex justify-between items-center p-4 sm:p-5 border-b border-[#A0D0D5]/50">
              <h3 className="text-xl font-bold text-[#1A0A3B] flex items-center">
                <ChatBubbleLeftEllipsisIcon className="w-7 h-7 mr-3 text-[#1E47A0]" />
                Asisten AI Nakes
              </h3>
              <button onClick={handleCloseAssistantModal} className="text-[#1A0A3B]/70 hover:text-[#1A0A3B] p-1 rounded-full hover:bg-[#E0F2F3]/50">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            {/* Konten Intro dari AssistantPage (disesuaikan stylingnya) */}
            <div className="p-4 sm:p-5 border-b border-[#A0D0D5]/30 bg-[#E0F2F3]/60"> {/* Warna disesuaikan */}
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 pt-1">
                  <InformationCircleIcon className="h-7 w-7 text-[#1E47A0]" /> {/* Heroicon & warna disesuaikan */}
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-[#1A0A3B]">Selamat Datang, Dr. {profileData.name}!</h2> {/* Warna disesuaikan */}
                  <p className="text-sm text-[#1A0A3B]/90 mt-1"> {/* Warna disesuaikan */}
                    Saya adalah asisten AI yang siap membantu menjawab pertanyaan Anda terkait SOP dan pedoman kesehatan.
                    Silakan ketik pertanyaan Anda di bawah.
                  </p>
                </div>
              </div>
            </div>

            {/* Komponen Chatbox Anda */}
            <div className="flex-grow flex flex-col p-1 sm:p-2 md:p-4 overflow-y-auto custom-scrollbar">
              {/* Pastikan Chatbox dapat menangani flex-grow dan scrolling internal jika perlu */}
              <Chatbox />
            </div>
            {/* Footer kecil di dalam modal jika diperlukan */}
            <div className="p-3 border-t border-[#A0D0D5]/30 bg-[#E0F2F3]/60 text-xs text-center text-[#1A0A3B]/70">
              SIAGA 3T+ AI Assistant
            </div>
          </FadeInUp>
        </div>
      )}
    </div>
  );
};

export default DashboardNakesPage;