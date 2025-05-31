// misal: app/admin/dashboard/AdminDashboardPageContent.tsx
"use client";

import Navbar from './sections/navbar';
import Footer from './sections/footer';
import React, { useState, useMemo, ChangeEvent, FormEvent, useEffect } from 'react';
import {
  UserGroupIcon, UsersIcon, CalendarDaysIcon, InboxIcon, PlusCircleIcon, MagnifyingGlassIcon,
  FunnelIcon, EyeIcon, PencilSquareIcon, TrashIcon, ChevronLeftIcon, ChevronRightIcon,
  ArrowPathIcon, DocumentChartBarIcon, Cog6ToothIcon, BellIcon, UserCircleIcon,
  ArrowDownTrayIcon, XMarkIcon, CheckCircleIcon, ExclamationTriangleIcon, InformationCircleIcon,
  BuildingOffice2Icon, BriefcaseIcon, HashtagIcon, IdentificationIcon, EnvelopeIcon,
  PhoneIcon, CakeIcon, MapPinIcon, QueueListIcon, ListBulletIcon, CalendarIcon,
  WrenchScrewdriverIcon, ChartPieIcon, BanknotesIcon
} from '@heroicons/react/24/outline';

// --- Definisi Tipe Data ---
interface Dokter {
  id: string; nama: string; avatar?: string; nik: string; noSTR: string; keahlian: string;
  status: "Aktif" | "Tidak Aktif"; email: string; telepon: string; tanggalBergabung: string;
}
interface Pasien {
  id: string; noRM: string; nama: string; avatar?: string; tanggalLahir: string; jenisKelamin: "Laki-laki" | "Perempuan";
  telepon: string; email?: string; alamat: string; tanggalRegistrasi: string; status: "Aktif" | "Nonaktif"; // Tambah status pasien
}
interface JanjiTemu {
  id: string; pasien: Pick<Pasien, 'id' | 'nama' | 'noRM'>; dokter: Pick<Dokter, 'id' | 'nama' | 'keahlian'>;
  tanggalWaktu: Date; keluhan: string; status: "Terjadwal" | "Selesai" | "Dibatalkan" | "Menunggu Konfirmasi";
}

// --- Data Dummy Awal ---
const initialDummyDokter: Dokter[] = [
  { id: 'D001', nama: 'Dr. Budi Santoso', avatar: 'https://i.pravatar.cc/150?u=dokter1', nik: '3201234567890001', noSTR: '12345/STR/2024', keahlian: 'Dokter Umum', status: 'Aktif', email: 'budi.s@example.com', telepon: '081234567890', tanggalBergabung: '2023-01-15' },
  { id: 'D002', nama: 'Dr. Citra Dewi', avatar: 'https://i.pravatar.cc/150?u=dokter2', nik: '3201234567890002', noSTR: '67890/STR/2023', keahlian: 'Dokter Anak', status: 'Aktif', email: 'citra.d@example.com', telepon: '081209876543', tanggalBergabung: '2022-11-20' },
  { id: 'D003', nama: 'Dr. Ahmad Husein', avatar: 'https://i.pravatar.cc/150?u=dokter3', nik: '3201234567890003', noSTR: '11223/STR/2022', keahlian: 'Penyakit Dalam', status: 'Tidak Aktif', email: 'ahmad.h@example.com', telepon: '081211223344', tanggalBergabung: '2022-05-10' },
];
const initialDummyPasien: Pasien[] = [
  { id: 'P001', noRM: 'RM00001', nama: 'Rina Amelia', avatar: 'https://i.pravatar.cc/150?u=pasien1', tanggalLahir: '1990-05-20', jenisKelamin: 'Perempuan', telepon: '085678901234', email: 'rina.a@example.com', alamat: 'Jl. Merdeka No. 10, Jakarta Pusat', tanggalRegistrasi: '2024-02-10', status: 'Aktif' },
  { id: 'P002', noRM: 'RM00002', nama: 'Joko Susilo', avatar: 'https://i.pravatar.cc/150?u=pasien2', tanggalLahir: '1985-11-12', jenisKelamin: 'Laki-laki', telepon: '087712345678', alamat: 'Jl. Sudirman No. 25, Bandung', tanggalRegistrasi: '2024-03-01', status: 'Aktif' },
  { id: 'P003', noRM: 'RM00003', nama: 'Siti Aminah', avatar: 'https://i.pravatar.cc/150?u=pasien3', tanggalLahir: '1995-01-30', jenisKelamin: 'Perempuan', telepon: '08111222333', alamat: 'Jl. Pahlawan No. 1, Surabaya', tanggalRegistrasi: '2023-12-15', status: 'Nonaktif' },
];
const initialDummyJanjiTemu: JanjiTemu[] = [
  { id: 'JT001', pasien: { id: 'P001', nama: 'Rina Amelia', noRM: 'RM00001' }, dokter: { id: 'D001', nama: 'Dr. Budi Santoso', keahlian: 'Dokter Umum' }, tanggalWaktu: new Date(new Date().setDate(new Date().getDate() + 1)), keluhan: 'Demam dan batuk', status: 'Terjadwal' },
  { id: 'JT002', pasien: { id: 'P002', nama: 'Joko Susilo', noRM: 'RM00002' }, dokter: { id: 'D002', nama: 'Dr. Citra Dewi', keahlian: 'Dokter Anak' }, tanggalWaktu: new Date(new Date().setDate(new Date().getDate() + 2)), keluhan: 'Vaksinasi anak', status: 'Terjadwal' },
  { id: 'JT003', pasien: { id: 'P001', nama: 'Rina Amelia', noRM: 'RM00001' }, dokter: { id: 'D003', nama: 'Dr. Ahmad Husein', keahlian: 'Penyakit Dalam' }, tanggalWaktu: new Date(new Date().setDate(new Date().getDate() - 5)), keluhan: 'Kontrol rutin diabetes', status: 'Selesai' },
];

// --- Komponen Styling Umum ---
const FloatingGeometricShapes: React.FC<{ shapeClassName?: string; count?: number; className?: string }> = ({ shapeClassName = "bg-[#A0D0D5]/5", count = 15, className = "" }) => ( <div className={`absolute inset-0 overflow-hidden -z-10 ${className}`}> {[...Array(count)].map((_, i) => { const size = Math.random() * 70 + 30; const type = Math.random(); return ( <div key={i} className={`absolute ${shapeClassName} animate-float`} style={{ width: `${size}px`, height: `${size}px`, left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 8}s`, animationDuration: `${Math.random() * 20 + 15}s`, opacity: Math.random() * 0.08 + 0.02, clipPath: type < 0.33 ? 'circle(50%)' : (type < 0.66 ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)') }} /> ); })} </div> );
interface FadeInUpProps { children: React.ReactNode; delay?: string; duration?: string; className?: string; }
const FadeInUp: React.FC<FadeInUpProps> = ({ children, delay = '', duration = 'duration-700', className = '' }) => { const [isVisible, setIsVisible] = useState(false); useEffect(() => { setIsVisible(true); }, []); return ( <div className={`transition-all ease-out ${duration} ${delay} ${className} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>{children}</div> ); };

const darkBluePageGradient = "bg-gradient-to-br from-[#1A0A3B] via-[#1E47A0] to-[#123A7A]";
const whiteBoxClass = "bg-white/95 backdrop-blur-xl shadow-2xl rounded-2xl p-6 md:p-8 border border-white/20"; // Opacity bg ditambah sedikit
const primaryDarkTextColor = "text-[#1A0A3B]";
const secondaryDarkTextColor = "text-[#1E47A0]";
const subtleDarkTextColor = "text-gray-600";
const lightInputBaseClass = `w-full bg-gray-50 border border-gray-300 ${primaryDarkTextColor} placeholder-gray-400 rounded-xl p-3 py-2.5 focus:ring-2 focus:ring-[#1E47A0] focus:border-[#1E47A0] transition-colors text-sm shadow-sm`; // py disesuaikan
const adminPrimaryButtonClass = `bg-gradient-to-r from-[#1E47A0] to-[#123A7A] hover:from-[#123A7A] hover:to-[#1E47A0] text-white font-semibold py-2.5 px-5 rounded-xl shadow-lg transform hover:scale-105 transition-all text-sm flex items-center justify-center gap-2`;
const adminSecondaryButtonClass = `bg-gray-100 hover:bg-gray-200 ${secondaryDarkTextColor} font-medium py-2 px-4 rounded-lg shadow-sm transition-colors text-xs flex items-center justify-center gap-1.5`;

interface KpiCardProps { title: string; value: string; icon: React.ElementType; trend?: string; trendColor?: string; unit?: string; iconColor?: string; }
const KpiCard: React.FC<KpiCardProps> = ({ title, value, icon: Icon, trend, trendColor = 'text-green-600', unit, iconColor = secondaryDarkTextColor }) => ( <div className={`bg-gray-50/80 backdrop-blur-md p-5 rounded-xl border border-gray-200 shadow-lg transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1`}> <div className="flex justify-between items-start mb-2"> <p className={`text-sm font-medium ${subtleDarkTextColor}`}>{title}</p> <Icon className={`w-7 h-7 ${iconColor} opacity-90`} /> </div> <p className={`text-3xl font-bold ${primaryDarkTextColor} mb-1`}>{value} <span className="text-base font-normal">{unit}</span></p> {trend && <p className={`text-xs ${trendColor}`}>{trend}</p>} </div> );
interface ModalProps { title: string; children: React.ReactNode; onClose: () => void; show: boolean; size?: 'md' | 'lg' | 'xl'; }
const Modal: React.FC<ModalProps> = ({ title, children, onClose, show, size = 'lg' }) => { if (!show) return null; const sizeClass = size === 'md' ? 'max-w-md' : size === 'xl' ? 'max-w-xl' : 'max-w-lg'; return ( <div className="fixed inset-0 bg-[#1A0A3B]/80 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-opacity duration-300" onClick={onClose}> <div className={`bg-white w-full ${sizeClass} max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl flex flex-col animate-fadeInUpModal`} onClick={(e) => e.stopPropagation()}> <div className={`flex justify-between items-center p-5 border-b border-gray-200`}> <h3 className={`text-xl font-semibold ${primaryDarkTextColor}`}>{title}</h3> <button onClick={onClose} className={`p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors`}> <XMarkIcon className="w-6 h-6" /> </button> </div> <div className="p-6 overflow-y-auto custom-scrollbar-light space-y-4"> {children} </div> </div> </div> ); };
// --- Akhir Komponen Styling Umum & UI Kecil ---

// ... (State dan fungsi lainnya dari implementasi AdminDashboardPageContent sebelumnya)
const AdminDashboardPageContent: React.FC = () => {
  // State Dokter
  const [dummyDokterList, setDummyDokterList] = useState<Dokter[]>(initialDummyDokter);
  const [searchTermDokter, setSearchTermDokter] = useState('');
  const [dokterStatusFilter, setDokterStatusFilter] = useState<'Semua' | 'Aktif' | 'Tidak Aktif'>('Semua');
  const [showTambahDokterModal, setShowTambahDokterModal] = useState(false);
  const [editingDokter, setEditingDokter] = useState<Dokter | null>(null);
  const [currentDokterFormData, setCurrentDokterFormData] = useState<Partial<Dokter>>({});
  const [showDetailDokter, setShowDetailDokter] = useState<Dokter | null>(null);

  // State Pasien
  const [dummyPasienList, setDummyPasienList] = useState<Pasien[]>(initialDummyPasien);
  const [searchTermPasien, setSearchTermPasien] = useState('');
  const [pasienStatusFilter, setPasienStatusFilter] = useState<'Semua' | 'Aktif' | 'Nonaktif'>('Semua');
  const [showTambahPasienModal, setShowTambahPasienModal] = useState(false);
  const [editingPasien, setEditingPasien] = useState<Pasien | null>(null);
  const [currentPasienFormData, setCurrentPasienFormData] = useState<Partial<Pasien>>({});
  const [showDetailPasien, setShowDetailPasien] = useState<Pasien | null>(null);

  // State Janji Temu
  const [dummyJanjiTemuList, setDummyJanjiTemuList] = useState<JanjiTemu[]>(initialDummyJanjiTemu);
  const [searchTermJanji, setSearchTermJanji] = useState('');
  const [janjiStatusFilter, setJanjiStatusFilter] = useState<'Semua' | JanjiTemu['status']>('Semua');
  const [showBuatJanjiModal, setShowBuatJanjiModal] = useState(false);
  const [currentJanjiFormData, setCurrentJanjiFormData] = useState<Partial<JanjiTemu & {pasienId?: string, dokterId?: string}>>({});


  useEffect(() => {
    if (editingDokter) setCurrentDokterFormData(editingDokter);
    else setCurrentDokterFormData({ status: 'Aktif', tanggalBergabung: new Date().toISOString().split('T')[0] });
  }, [editingDokter, showTambahDokterModal]);

  useEffect(() => {
    if (editingPasien) setCurrentPasienFormData(editingPasien);
    else setCurrentPasienFormData({ status: 'Aktif', jenisKelamin: 'Laki-laki', tanggalRegistrasi: new Date().toISOString().split('T')[0] });
  }, [editingPasien, showTambahPasienModal]);
  
  useEffect(() => {
    setCurrentJanjiFormData({ status: 'Terjadwal', tanggalWaktu: new Date() });
  }, [showBuatJanjiModal]);


  const filteredDokter = useMemo(() => dummyDokterList.filter(d => (d.nama.toLowerCase().includes(searchTermDokter.toLowerCase()) || d.keahlian.toLowerCase().includes(searchTermDokter.toLowerCase())) && (dokterStatusFilter === 'Semua' || d.status === dokterStatusFilter)), [dummyDokterList, searchTermDokter, dokterStatusFilter]);
  const filteredPasien = useMemo(() => dummyPasienList.filter(p => (p.nama.toLowerCase().includes(searchTermPasien.toLowerCase()) || p.noRM.toLowerCase().includes(searchTermPasien.toLowerCase())) && (pasienStatusFilter === 'Semua' || p.status === pasienStatusFilter)), [dummyPasienList, searchTermPasien, pasienStatusFilter]);
  const filteredJanjiTemu = useMemo(() => dummyJanjiTemuList.filter(jt => (jt.pasien.nama.toLowerCase().includes(searchTermJanji.toLowerCase()) || jt.dokter.nama.toLowerCase().includes(searchTermJanji.toLowerCase())) && (janjiStatusFilter === 'Semua' || jt.status === janjiStatusFilter)), [dummyJanjiTemuList, searchTermJanji, janjiStatusFilter]);

  const kpiData = [ /* ... (sama) ... */ 
    { title: "Total Dokter Aktif", value: dummyDokterList.filter(d=>d.status==='Aktif').length.toString(), icon: BriefcaseIcon, unit: "Dokter", trend: "+2 bln ini", trendColor: "text-green-600", iconColor: "text-sky-600" },
    { title: "Total Pasien Aktif", value: dummyPasienList.filter(p=>p.status==='Aktif').length.toString(), icon: UsersIcon, unit: "Pasien", trend: "+10 mgg ini", trendColor: "text-green-600", iconColor: "text-teal-600" },
    { title: "Janji Temu Hari Ini", value: dummyJanjiTemuList.filter(jt => new Date(jt.tanggalWaktu).toDateString() === new Date().toDateString() && jt.status === "Terjadwal").length.toString(), icon: CalendarDaysIcon, unit: "Janji", trend: "3 menunggu", trendColor: "text-amber-600", iconColor: "text-indigo-600" },
    { title: "Laporan Dihasilkan", value: "5", icon: DocumentChartBarIcon, unit: "Minggu Ini", trend: "2 baru", trendColor: "text-sky-600", iconColor: "text-rose-600" },
  ];

  // --- CRUD Dokter ---
  const handleOpenTambahDokterModal = () => { setEditingDokter(null); setShowTambahDokterModal(true); };
  const handleOpenEditDokterModal = (dokter: Dokter) => { setEditingDokter(dokter); setShowTambahDokterModal(true); };
  const handleDokterFormChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setCurrentDokterFormData(prev => ({...prev, [e.target.name]: e.target.value }));
  const handleSimpanDokter = (e: FormEvent) => { /* ... (sama, tapi gunakan setCurrentDokterFormData) ... */ 
    e.preventDefault();
    const {nama, nik, noSTR, keahlian, email, telepon} = currentDokterFormData;
    if (!nama || !nik || !noSTR || !keahlian || !email || !telepon) { alert("Mohon lengkapi field wajib dokter."); return; }
    if (editingDokter) {
      setDummyDokterList(prev => prev.map(d => d.id === editingDokter.id ? { ...d, ...currentDokterFormData } as Dokter : d));
      alert(`Data dokter ${currentDokterFormData.nama} diperbarui.`);
    } else {
      const newId = 'D' + Date.now().toString();
      setDummyDokterList(prev => [{ id: newId, ...currentDokterFormData } as Dokter, ...prev]);
      alert(`Dokter ${currentDokterFormData.nama} ditambahkan.`);
    }
    setShowTambahDokterModal(false);
  };
  const handleHapusDokter = (dokter: Dokter) => { if (window.confirm(`Hapus dokter ${dokter.nama}?`)) { setDummyDokterList(prev => prev.filter(d => d.id !== dokter.id)); alert(`Dokter ${dokter.nama} dihapus.`); }};
  const handleUbahStatusDokter = (dokter: Dokter) => { setDummyDokterList(prev => prev.map(d => d.id === dokter.id ? { ...d, status: d.status === 'Aktif' ? 'Tidak Aktif' : 'Aktif' } : d)); alert(`Status dokter ${dokter.nama} diubah.`); };

  // --- CRUD Pasien ---
  const handleOpenTambahPasienModal = () => { setEditingPasien(null); setShowTambahPasienModal(true); };
  const handleOpenEditPasienModal = (pasien: Pasien) => { setEditingPasien(pasien); setShowTambahPasienModal(true); };
  const handlePasienFormChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setCurrentPasienFormData(prev => ({...prev, [e.target.name]: e.target.value }));
  const handleSimpanPasien = (e: FormEvent) => {
    e.preventDefault();
    const {nama, noRM, tanggalLahir, jenisKelamin, telepon, alamat} = currentPasienFormData;
    if (!nama || !noRM || !tanggalLahir || !jenisKelamin || !telepon || !alamat) { alert("Mohon lengkapi field wajib pasien."); return; }
    if (editingPasien) {
      setDummyPasienList(prev => prev.map(p => p.id === editingPasien.id ? { ...p, ...currentPasienFormData } as Pasien : p));
      alert(`Data pasien ${currentPasienFormData.nama} diperbarui.`);
    } else {
      const newId = 'P' + Date.now().toString();
      setDummyPasienList(prev => [{ id: newId, ...currentPasienFormData } as Pasien, ...prev]);
      alert(`Pasien ${currentPasienFormData.nama} ditambahkan.`);
    }
    setShowTambahPasienModal(false);
  };
  const handleHapusPasien = (pasien: Pasien) => { if (window.confirm(`Hapus pasien ${pasien.nama}?`)) { setDummyPasienList(prev => prev.filter(p => p.id !== pasien.id)); alert(`Pasien ${pasien.nama} dihapus.`); }};
  const handleUbahStatusPasien = (pasien: Pasien) => { setDummyPasienList(prev => prev.map(p => p.id === pasien.id ? { ...p, status: p.status === 'Aktif' ? 'Nonaktif' : 'Aktif' } : p)); alert(`Status pasien ${pasien.nama} diubah.`);};

  // --- CRUD Janji Temu ---
  const handleOpenBuatJanjiModal = () => { setCurrentJanjiFormData({status: 'Terjadwal', tanggalWaktu: new Date()}); setShowBuatJanjiModal(true); };
  const handleJanjiFormChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const {name, value} = e.target;
    if (name === "tanggalWaktu") {
        setCurrentJanjiFormData(prev => ({...prev, [name]: new Date(value)}));
    } else {
        setCurrentJanjiFormData(prev => ({...prev, [name]: value}));
    }
  };
  const handleSimpanJanji = (e: FormEvent) => {
    e.preventDefault();
    const {pasienId, dokterId, tanggalWaktu, keluhan, status} = currentJanjiFormData;
    const selectedPasien = dummyPasienList.find(p => p.id === pasienId);
    const selectedDokter = dummyDokterList.find(d => d.id === dokterId);

    if (!selectedPasien || !selectedDokter || !tanggalWaktu || !keluhan || !status) { alert("Mohon lengkapi semua field janji temu."); return; }
    
    const newId = 'JT' + Date.now().toString();
    const janjiToAdd: JanjiTemu = {
        id: newId,
        pasien: {id: selectedPasien.id, nama: selectedPasien.nama, noRM: selectedPasien.noRM},
        dokter: {id: selectedDokter.id, nama: selectedDokter.nama, keahlian: selectedDokter.keahlian},
        tanggalWaktu: new Date(tanggalWaktu),
        keluhan: keluhan as string,
        status: status as JanjiTemu['status']
    };
    setDummyJanjiTemuList(prev => [janjiToAdd, ...prev].sort((a,b) => new Date(b.tanggalWaktu).getTime() - new Date(a.tanggalWaktu).getTime()));
    alert(`Janji temu untuk ${selectedPasien.nama} dengan ${selectedDokter.nama} berhasil dibuat.`);
    setShowBuatJanjiModal(false);
  };
  const handleUbahStatusJanji = (janji: JanjiTemu, newStatus: JanjiTemu['status']) => {
    setDummyJanjiTemuList(prev => prev.map(jt => jt.id === janji.id ? {...jt, status: newStatus} : jt));
    alert(`Status janji temu ${janji.id} diubah menjadi ${newStatus}.`);
  }

  // ... (return JSX utama)

  return (
    <main className={`flex-1 ${darkBluePageGradient} relative selection:bg-[#A0D0D5] selection:text-[#1A0A3B] py-20 overflow-y-auto custom-scrollbar-dark`}>
          <Navbar />
      <FloatingGeometricShapes shapeClassName="bg-[#A0D0D5]/5" count={25} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <FadeInUp>
            <h1 className={`text-4xl md:text-5xl font-bold text-white mb-12 text-center tracking-tight`}>Dashboard Administrasi Sistem</h1>
        </FadeInUp>

        <div className="space-y-10 md:space-y-12">
            {/* 1. Ringkasan Dashboard */}
            <section id="ringkasan">
                <FadeInUp className={whiteBoxClass}>
                    <h2 className={`text-2xl md:text-3xl font-semibold mb-6 ${primaryDarkTextColor}`}>Ringkasan Umum</h2>
                    {/* ... Konten KPI dan Tombol Aksi Cepat ... */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"> {kpiData.map(kpi => <KpiCard key={kpi.title} {...kpi} />)} </div>
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-5"> <button onClick={handleOpenTambahDokterModal} className={adminPrimaryButtonClass}><PlusCircleIcon className="w-5 h-5"/> Tambah Dokter</button> <button onClick={handleOpenTambahPasienModal} className={adminPrimaryButtonClass}><UserGroupIcon className="w-5 h-5"/> Registrasi Pasien</button> <button onClick={() => alert('Fitur Pengumuman Global belum aktif')} className={adminPrimaryButtonClass}><BellIcon className="w-5 h-5"/> Buat Pengumuman</button> </div>
                </FadeInUp>
            </section>

            {/* 2. Kelola Data Dokter */}
            <section id="kelola-dokter">
                <FadeInUp delay="delay-[100ms]" className={whiteBoxClass}>
                    {/* ... (Konten Kelola Dokter yang sudah difungsikan) ... */}
                    <div className="flex flex-col xl:flex-row justify-between items-center mb-6 gap-4"> <h2 className={`text-2xl md:text-3xl font-semibold ${primaryDarkTextColor} whitespace-nowrap`}>Manajemen Data Dokter</h2> <div className="flex flex-col sm:flex-row items-center gap-3 w-full xl:w-auto"> <div className="relative w-full sm:w-60"> <input type="text" placeholder="Cari dokter (nama, keahlian)..." value={searchTermDokter} onChange={(e) => setSearchTermDokter(e.target.value)} className={`${lightInputBaseClass} pr-10`} /> <MagnifyingGlassIcon className={`w-5 h-5 ${subtleDarkTextColor} absolute right-3 top-1/2 -translate-y-1/2`} /> </div> <div className="relative w-full sm:w-auto"> <select value={dokterStatusFilter} onChange={(e) => setDokterStatusFilter(e.target.value as any)} className={`${lightInputBaseClass} min-w-[150px]`}> <option value="Semua">Semua Status</option> <option value="Aktif">Aktif</option> <option value="Tidak Aktif">Tidak Aktif</option> </select> </div> <button onClick={handleOpenTambahDokterModal} className={`${adminPrimaryButtonClass} w-full sm:w-auto`}><PlusCircleIcon className="w-5 h-5"/> Tambah</button> </div> </div>
                    {/* Tabel Dokter */}
                    <div className="overflow-x-auto custom-scrollbar-light rounded-lg border border-gray-200"> <table className="w-full min-w-[900px] text-sm text-left"> <thead className={`border-b border-gray-200 ${subtleDarkTextColor} uppercase tracking-wider text-xs bg-gray-50`}> <tr> <th scope="col" className="py-3.5 px-4">Nama Dokter</th> <th scope="col" className="py-3.5 px-4">Keahlian</th> <th scope="col" className="py-3.5 px-4">Status</th> <th scope="col" className="py-3.5 px-4">Kontak</th> <th scope="col" className="py-3.5 px-4 text-center">Aksi</th> </tr> </thead> <tbody className={`${primaryDarkTextColor} divide-y divide-gray-200`}> {filteredDokter.map((dokter) => ( <tr key={dokter.id} className={`hover:bg-gray-50/70 transition-colors duration-150`}> <td className="py-3 px-4 font-medium flex items-center gap-3"> {dokter.avatar ? <img src={dokter.avatar} alt={dokter.nama} className="w-10 h-10 rounded-full object-cover border border-gray-200"/> : <UserCircleIcon className="w-10 h-10 text-gray-400"/> } <div>{dokter.nama}<p className='text-xs text-gray-500'>STR: {dokter.noSTR}</p></div> </td> <td className="py-3 px-4">{dokter.keahlian}</td> <td className="py-3 px-4"> <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${dokter.status === 'Aktif' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'}`}>{dokter.status}</span> </td> <td className="py-3 px-4 text-xs">{dokter.email}<br/>{dokter.telepon}</td> <td className="py-3 px-4 text-center"> <div className="flex justify-center items-center gap-1.5"> <button onClick={() => setShowDetailDokter(dokter)} className={`${adminSecondaryButtonClass} p-1.5`} title="Lihat Detail"><EyeIcon className="w-4 h-4"/></button> <button onClick={() => handleOpenEditDokterModal(dokter)} className={`${adminSecondaryButtonClass} p-1.5`} title="Edit"><PencilSquareIcon className="w-4 h-4"/></button> <button onClick={() => handleUbahStatusDokter(dokter)} className={`${adminSecondaryButtonClass} p-1.5`} title="Ubah Status"><ArrowPathIcon className="w-4 h-4"/></button> <button onClick={() => handleHapusDokter(dokter)} className={`${adminSecondaryButtonClass} !text-red-500 hover:!bg-red-100 p-1.5`} title="Hapus"><TrashIcon className="w-4 h-4"/></button> </div> </td> </tr> ))} {filteredDokter.length === 0 && <tr><td colSpan={5} className={`text-center py-10 ${subtleDarkTextColor}`}>Tidak ada data dokter ditemukan.</td></tr>} </tbody> </table> </div>
                    {/* Pagination Dokter */}
                    <div className={`flex flex-col sm:flex-row justify-between items-center mt-6 text-sm ${subtleDarkTextColor}`}> <span>Menampilkan {filteredDokter.length > 0 ? `1-${Math.min(5, filteredDokter.length)}` : 0} dari {filteredDokter.length} data</span> <div className="flex gap-1 mt-3 sm:mt-0"> <button className={adminSecondaryButtonClass} disabled><ChevronLeftIcon className="w-4 h-4"/></button> <button className={adminSecondaryButtonClass}><ChevronRightIcon className="w-4 h-4"/></button> </div> </div>
                </FadeInUp>
            </section>

            {/* 3. Kelola Data Pasien */}
            <section id="kelola-pasien">
                <FadeInUp delay="delay-[200ms]" className={whiteBoxClass}>
                    <div className="flex flex-col xl:flex-row justify-between items-center mb-6 gap-4"> <h2 className={`text-2xl md:text-3xl font-semibold ${primaryDarkTextColor} whitespace-nowrap`}>Manajemen Data Pasien</h2> <div className="flex flex-col sm:flex-row items-center gap-3 w-full xl:w-auto"> <div className="relative w-full sm:w-60"> <input type="text" placeholder="Cari pasien (nama, No.RM)..." value={searchTermPasien} onChange={(e) => setSearchTermPasien(e.target.value)} className={`${lightInputBaseClass} pr-10`} /> <MagnifyingGlassIcon className={`w-5 h-5 ${subtleDarkTextColor} absolute right-3 top-1/2 -translate-y-1/2`} /> </div> <div className="relative w-full sm:w-auto"> <select value={pasienStatusFilter} onChange={(e) => setPasienStatusFilter(e.target.value as any)} className={`${lightInputBaseClass} min-w-[150px]`}> <option value="Semua">Semua Status</option> <option value="Aktif">Aktif</option> <option value="Nonaktif">Nonaktif</option> </select> </div> <button onClick={handleOpenTambahPasienModal} className={`${adminPrimaryButtonClass} w-full sm:w-auto`}><UserGroupIcon className="w-5 h-5"/> Tambah</button> </div> </div>
                    {/* Tabel Pasien */}
                    <div className="overflow-x-auto custom-scrollbar-light rounded-lg border border-gray-200"> <table className="w-full min-w-[900px] text-sm text-left"> <thead className={`border-b border-gray-200 ${subtleDarkTextColor} uppercase tracking-wider text-xs bg-gray-50`}> <tr> <th scope="col" className="py-3.5 px-4">Nama Pasien</th> <th scope="col" className="py-3.5 px-4">No. RM</th> <th scope="col" className="py-3.5 px-4">Tgl Lahir</th> <th scope="col" className="py-3.5 px-4">Status</th> <th scope="col" className="py-3.5 px-4">Kontak</th> <th scope="col" className="py-3.5 px-4 text-center">Aksi</th> </tr> </thead> <tbody className={`${primaryDarkTextColor} divide-y divide-gray-200`}> {filteredPasien.map((pasien) => ( <tr key={pasien.id} className={`hover:bg-gray-50/70 transition-colors duration-150`}> <td className="py-3 px-4 font-medium flex items-center gap-3"> {pasien.avatar ? <img src={pasien.avatar} alt={pasien.nama} className="w-10 h-10 rounded-full object-cover border border-gray-200"/> : <UserCircleIcon className="w-10 h-10 text-gray-400"/> } {pasien.nama} </td> <td className="py-3 px-4 font-mono">{pasien.noRM}</td> <td className="py-3 px-4">{new Date(pasien.tanggalLahir).toLocaleDateString('id-ID', {day:'2-digit', month:'short', year:'numeric'})}</td> <td className="py-3 px-4"> <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${pasien.status === 'Aktif' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'}`}>{pasien.status}</span> </td> <td className="py-3 px-4 text-xs">{pasien.telepon}{pasien.email && <><br/>{pasien.email}</>}</td> <td className="py-3 px-4 text-center"> <div className="flex justify-center items-center gap-1.5"> <button onClick={() => setShowDetailPasien(pasien)} className={`${adminSecondaryButtonClass} p-1.5`} title="Lihat Detail"><EyeIcon className="w-4 h-4"/></button> <button onClick={() => handleOpenEditPasienModal(pasien)} className={`${adminSecondaryButtonClass} p-1.5`} title="Edit"><PencilSquareIcon className="w-4 h-4"/></button> <button onClick={() => handleUbahStatusPasien(pasien)} className={`${adminSecondaryButtonClass} p-1.5`} title="Ubah Status"><ArrowPathIcon className="w-4 h-4"/></button> <button onClick={() => handleHapusPasien(pasien)} className={`${adminSecondaryButtonClass} !text-red-500 hover:!bg-red-100 p-1.5`} title="Hapus"><TrashIcon className="w-4 h-4"/></button> </div> </td> </tr> ))} {filteredPasien.length === 0 && <tr><td colSpan={6} className={`text-center py-10 ${subtleDarkTextColor}`}>Tidak ada data pasien ditemukan.</td></tr>} </tbody> </table> </div>
                     {/* Pagination Pasien */}
                    <div className={`flex flex-col sm:flex-row justify-between items-center mt-6 text-sm ${subtleDarkTextColor}`}> <span>Menampilkan {filteredPasien.length > 0 ? `1-${Math.min(5, filteredPasien.length)}` : 0} dari {filteredPasien.length} data</span> <div className="flex gap-1 mt-3 sm:mt-0"> <button className={adminSecondaryButtonClass} disabled><ChevronLeftIcon className="w-4 h-4"/></button> <button className={adminSecondaryButtonClass}><ChevronRightIcon className="w-4 h-4"/></button> </div> </div>
                </FadeInUp>
            </section>

            {/* 4. Manajemen Jadwal & Janji Temu */}
            <section id="manajemen-jadwal">
                 <FadeInUp delay="delay-[300ms]" className={whiteBoxClass}>
                    <div className="flex flex-col xl:flex-row justify-between items-center mb-6 gap-4"> <h2 className={`text-2xl md:text-3xl font-semibold ${primaryDarkTextColor} whitespace-nowrap`}>Manajemen Janji Temu</h2> <div className="flex flex-col sm:flex-row items-center gap-3 w-full xl:w-auto"> <div className="relative w-full sm:w-60"> <input type="text" placeholder="Cari janji (pasien, dokter)..." value={searchTermJanji} onChange={(e) => setSearchTermJanji(e.target.value)} className={`${lightInputBaseClass} pr-10`} /> <MagnifyingGlassIcon className={`w-5 h-5 ${subtleDarkTextColor} absolute right-3 top-1/2 -translate-y-1/2`} /> </div> <div className="relative w-full sm:w-auto"> <select value={janjiStatusFilter} onChange={(e) => setJanjiStatusFilter(e.target.value as any)} className={`${lightInputBaseClass} min-w-[180px]`}> <option value="Semua">Semua Status Janji</option> <option value="Terjadwal">Terjadwal</option> <option value="Menunggu Konfirmasi">Menunggu Konfirmasi</option> <option value="Selesai">Selesai</option> <option value="Dibatalkan">Dibatalkan</option> </select> </div> <button onClick={handleOpenBuatJanjiModal} className={`${adminPrimaryButtonClass} w-full sm:w-auto`}><CalendarDaysIcon className="w-5 h-5"/> Buat Janji</button> </div> </div>
                    {/* Tabel Janji Temu */}
                    <div className="overflow-x-auto custom-scrollbar-light rounded-lg border border-gray-200"> <table className="w-full min-w-[900px] text-sm text-left"> <thead className={`border-b border-gray-200 ${subtleDarkTextColor} uppercase tracking-wider text-xs bg-gray-50`}> <tr> <th scope="col" className="py-3.5 px-4">Pasien</th> <th scope="col" className="py-3.5 px-4">Dokter</th> <th scope="col" className="py-3.5 px-4">Tanggal & Waktu</th> <th scope="col" className="py-3.5 px-4">Keluhan</th> <th scope="col" className="py-3.5 px-4">Status</th> <th scope="col" className="py-3.5 px-4 text-center">Aksi</th> </tr> </thead> <tbody className={`${primaryDarkTextColor} divide-y divide-gray-200`}> {filteredJanjiTemu.map((jt) => ( <tr key={jt.id} className={`hover:bg-gray-50/70 transition-colors duration-150`}> <td className="py-3 px-4 font-medium">{jt.pasien.nama}<p className='text-xs text-gray-500'>RM: {jt.pasien.noRM}</p></td> <td className="py-3 px-4">{jt.dokter.nama}<p className='text-xs text-gray-500'>{jt.dokter.keahlian}</p></td> <td className="py-3 px-4">{new Date(jt.tanggalWaktu).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}</td> <td className="py-3 px-4 text-xs truncate max-w-xs">{jt.keluhan}</td> <td className="py-3 px-4"> <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${jt.status === 'Terjadwal' ? 'bg-sky-100 text-sky-700 border-sky-200' : jt.status === 'Selesai' ? 'bg-green-100 text-green-700 border-green-200' : jt.status === 'Dibatalkan' ? 'bg-red-100 text-red-700 border-red-200' : 'bg-yellow-100 text-yellow-700 border-yellow-200'}`}>{jt.status}</span> </td> <td className="py-3 px-4 text-center"> <div className="flex justify-center items-center gap-1.5"> <button onClick={() => alert(`Detail Janji: ${jt.id}`)} className={`${adminSecondaryButtonClass} p-1.5`} title="Detail"><EyeIcon className="w-4 h-4"/></button> {jt.status !== 'Selesai' && jt.status !== 'Dibatalkan' && <button onClick={() => handleUbahStatusJanji(jt, 'Selesai')} className={`${adminSecondaryButtonClass} !text-green-500 hover:!bg-green-100 p-1.5`} title="Tandai Selesai"><CheckCircleIcon className="w-4 h-4"/></button>} {jt.status === 'Terjadwal' && <button onClick={() => handleUbahStatusJanji(jt, 'Dibatalkan')} className={`${adminSecondaryButtonClass} !text-red-500 hover:!bg-red-100 p-1.5`} title="Batalkan"><XMarkIcon className="w-4 h-4"/></button>} </div> </td> </tr> ))} {filteredJanjiTemu.length === 0 && <tr><td colSpan={6} className={`text-center py-10 ${subtleDarkTextColor}`}>Tidak ada data janji temu ditemukan.</td></tr>} </tbody> </table> </div>
                    {/* Pagination Janji Temu */}
                    <div className={`flex flex-col sm:flex-row justify-between items-center mt-6 text-sm ${subtleDarkTextColor}`}> <span>Menampilkan {filteredJanjiTemu.length > 0 ? `1-${Math.min(5, filteredJanjiTemu.length)}` : 0} dari {filteredJanjiTemu.length} data</span> <div className="flex gap-1 mt-3 sm:mt-0"> <button className={adminSecondaryButtonClass} disabled><ChevronLeftIcon className="w-4 h-4"/></button> <button className={adminSecondaryButtonClass}><ChevronRightIcon className="w-4 h-4"/></button> </div> </div>
                 </FadeInUp>
            </section>

            {/* 5. Pusat Laporan & Analitik */}
            <section id="laporan-analitik">
                 <FadeInUp delay="delay-[400ms]" className={whiteBoxClass}>
                    <h2 className={`text-2xl md:text-3xl font-semibold mb-8 ${primaryDarkTextColor}`}>Pusat Laporan & Analitik</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            {title: "Aktivitas Dokter", desc:"Jumlah pasien, jam praktik, diagnosis terbanyak.", icon: BriefcaseIcon, action:"Generate Laporan Dokter"},
                            {title: "Demografi Pasien", desc:"Distribusi usia, jenis kelamin, wilayah.", icon: UsersIcon, action:"Generate Laporan Pasien"},
                            {title: "Utilisaasi Janji Temu", desc:"Tingkat kehadiran, pembatalan, waktu tunggu.", icon: CalendarDaysIcon, action:"Generate Laporan Janji Temu"},
                            {title: "Penggunaan Obat", desc:"Tren peresepan, kategori obat populer, stok.", icon: QueueListIcon, action:"Generate Laporan Obat"},
                            {title: "Kinerja Keuangan", desc:"Ringkasan pendapatan, biaya operasional.", icon: BanknotesIcon, action:"Generate Laporan Keuangan"},
                            {title: "Log Aktivitas Sistem", desc:"Catatan perubahan data penting oleh admin.", icon: WrenchScrewdriverIcon, action:"Lihat Log Aktivitas"},
                        ].map(report => (
                            <div key={report.title} className={`bg-gray-50/90 border border-gray-200 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow flex flex-col`}>
                                <report.icon className={`w-10 h-10 mb-3 ${secondaryDarkTextColor} opacity-80`}/>
                                <h4 className={`text-lg font-semibold mb-1.5 ${primaryDarkTextColor}`}>{report.title}</h4>
                                <p className={`text-xs mb-5 ${subtleDarkTextColor} flex-grow`}>{report.desc}</p>
                                <button onClick={() => alert(`${report.action} belum diimplementasikan.`)} className={`${adminPrimaryButtonClass} w-full mt-auto`}>
                                    <ArrowDownTrayIcon className="w-4 h-4 mr-2"/>Generate / Lihat
                                </button>
                            </div>
                        ))}
                    </div>
                 </FadeInUp>
            </section>
        </div>
      </div>

        {/* --- Modals --- */}
        <Modal title={editingDokter ? "Edit Data Dokter" : "Tambah Dokter Baru"} show={showTambahDokterModal} onClose={() => {setShowTambahDokterModal(false); setEditingDokter(null);}} size="lg">
            <form className="space-y-4" onSubmit={handleSimpanDokter}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4">
                    <div><label className={`block text-sm font-medium mb-1 ${secondaryDarkTextColor}`}>Nama Lengkap <span className="text-red-500">*</span></label><input type="text" name="nama" value={currentDokterFormData.nama || ''} onChange={handleDokterFormChange} required className={lightInputBaseClass} /></div>
                    <div><label className={`block text-sm font-medium mb-1 ${secondaryDarkTextColor}`}>NIK <span className="text-red-500">*</span></label><input type="text" name="nik" value={currentDokterFormData.nik || ''} onChange={handleDokterFormChange} maxLength={16} required className={lightInputBaseClass} /></div>
                    <div><label className={`block text-sm font-medium mb-1 ${secondaryDarkTextColor}`}>Nomor STR <span className="text-red-500">*</span></label><input type="text" name="noSTR" value={currentDokterFormData.noSTR || ''} onChange={handleDokterFormChange} required className={lightInputBaseClass} /></div>
                    <div><label className={`block text-sm font-medium mb-1 ${secondaryDarkTextColor}`}>Keahlian <span className="text-red-500">*</span></label><input type="text" name="keahlian" value={currentDokterFormData.keahlian || ''} onChange={handleDokterFormChange} required className={lightInputBaseClass} /></div>
                    <div><label className={`block text-sm font-medium mb-1 ${secondaryDarkTextColor}`}>Email <span className="text-red-500">*</span></label><input type="email" name="email" value={currentDokterFormData.email || ''} onChange={handleDokterFormChange} required className={lightInputBaseClass} /></div>
                    <div><label className={`block text-sm font-medium mb-1 ${secondaryDarkTextColor}`}>Telepon <span className="text-red-500">*</span></label><input type="tel" name="telepon" value={currentDokterFormData.telepon || ''} onChange={handleDokterFormChange} required className={lightInputBaseClass} /></div>
                    <div><label className={`block text-sm font-medium mb-1 ${secondaryDarkTextColor}`}>Tanggal Bergabung <span className="text-red-500">*</span></label><input type="date" name="tanggalBergabung" value={currentDokterFormData.tanggalBergabung || ''} onChange={handleDokterFormChange} required className={`${lightInputBaseClass}`} /></div>
                    <div> <label className={`block text-sm font-medium mb-1 ${secondaryDarkTextColor}`}>Status</label> <select name="status" value={currentDokterFormData.status || 'Aktif'} onChange={handleDokterFormChange} className={lightInputBaseClass}> <option value="Aktif">Aktif</option> <option value="Tidak Aktif">Tidak Aktif</option> </select> </div>
                    <div className="md:col-span-2"><label className={`block text-sm font-medium mb-1 ${secondaryDarkTextColor}`}>URL Avatar (Opsional)</label><input type="url" name="avatar" value={currentDokterFormData.avatar || ''} placeholder="https://..." onChange={handleDokterFormChange} className={lightInputBaseClass} /></div>
                </div>
                <div className="pt-5 flex justify-end gap-3 border-t border-gray-200 mt-6"> <button type="button" onClick={() => {setShowTambahDokterModal(false); setEditingDokter(null);}} className={adminSecondaryButtonClass}>Batal</button> <button type="submit" className={adminPrimaryButtonClass}>{editingDokter ? "Simpan Perubahan" : "Simpan Dokter"}</button> </div>
            </form>
        </Modal>

        <Modal title={editingPasien ? "Edit Data Pasien" : "Tambah Pasien Baru"} show={showTambahPasienModal} onClose={() => {setShowTambahPasienModal(false); setEditingPasien(null);}} size="lg">
             <form className="space-y-4" onSubmit={handleSimpanPasien}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4">
                    <div><label className={`block text-sm font-medium mb-1 ${secondaryDarkTextColor}`}>No. RM <span className="text-red-500">*</span></label><input type="text" name="noRM" value={currentPasienFormData.noRM || ''} onChange={handlePasienFormChange} required className={lightInputBaseClass} placeholder={editingPasien ? undefined : "Otomatis jika baru"} disabled={!!editingPasien}/></div>
                    <div><label className={`block text-sm font-medium mb-1 ${secondaryDarkTextColor}`}>Nama Lengkap <span className="text-red-500">*</span></label><input type="text" name="nama" value={currentPasienFormData.nama || ''} onChange={handlePasienFormChange} required className={lightInputBaseClass} /></div>
                    <div><label className={`block text-sm font-medium mb-1 ${secondaryDarkTextColor}`}>Tanggal Lahir <span className="text-red-500">*</span></label><input type="date" name="tanggalLahir" value={currentPasienFormData.tanggalLahir || ''} onChange={handlePasienFormChange} required className={`${lightInputBaseClass}`} /></div>
                    <div> <label className={`block text-sm font-medium mb-1 ${secondaryDarkTextColor}`}>Jenis Kelamin <span className="text-red-500">*</span></label> <select name="jenisKelamin" value={currentPasienFormData.jenisKelamin || 'Laki-laki'} onChange={handlePasienFormChange} className={lightInputBaseClass}> <option value="Laki-laki">Laki-laki</option> <option value="Perempuan">Perempuan</option> </select> </div>
                    <div><label className={`block text-sm font-medium mb-1 ${secondaryDarkTextColor}`}>Telepon <span className="text-red-500">*</span></label><input type="tel" name="telepon" value={currentPasienFormData.telepon || ''} onChange={handlePasienFormChange} required className={lightInputBaseClass} /></div>
                    <div><label className={`block text-sm font-medium mb-1 ${secondaryDarkTextColor}`}>Email (Opsional)</label><input type="email" name="email" value={currentPasienFormData.email || ''} onChange={handlePasienFormChange} className={lightInputBaseClass} /></div>
                    <div className="md:col-span-2"><label className={`block text-sm font-medium mb-1 ${secondaryDarkTextColor}`}>Alamat Lengkap <span className="text-red-500">*</span></label><textarea name="alamat" value={currentPasienFormData.alamat || ''} onChange={handlePasienFormChange} rows={3} required className={lightInputBaseClass}></textarea></div>
                    <div><label className={`block text-sm font-medium mb-1 ${secondaryDarkTextColor}`}>Tanggal Registrasi <span className="text-red-500">*</span></label><input type="date" name="tanggalRegistrasi" value={currentPasienFormData.tanggalRegistrasi || ''} onChange={handlePasienFormChange} required className={`${lightInputBaseClass}`} /></div>
                    <div> <label className={`block text-sm font-medium mb-1 ${secondaryDarkTextColor}`}>Status</label> <select name="status" value={currentPasienFormData.status || 'Aktif'} onChange={handlePasienFormChange} className={lightInputBaseClass}> <option value="Aktif">Aktif</option> <option value="Nonaktif">Nonaktif</option> </select> </div>
                    <div className="md:col-span-2"><label className={`block text-sm font-medium mb-1 ${secondaryDarkTextColor}`}>URL Avatar (Opsional)</label><input type="url" name="avatar" value={currentPasienFormData.avatar || ''} placeholder="https://..." onChange={handlePasienFormChange} className={lightInputBaseClass} /></div>
                </div>
                <div className="pt-5 flex justify-end gap-3 border-t border-gray-200 mt-6"> <button type="button" onClick={() => {setShowTambahPasienModal(false); setEditingPasien(null);}} className={adminSecondaryButtonClass}>Batal</button> <button type="submit" className={adminPrimaryButtonClass}>{editingPasien ? "Simpan Perubahan" : "Simpan Pasien"}</button> </div>
            </form>
        </Modal>

        <Modal title="Buat Janji Temu Baru" show={showBuatJanjiModal} onClose={()=>setShowBuatJanjiModal(false)} size="lg">
            <form className="space-y-4" onSubmit={handleSimpanJanji}>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4">
                    <div> <label className={`block text-sm font-medium mb-1 ${secondaryDarkTextColor}`}>Pilih Pasien <span className="text-red-500">*</span></label> <select name="pasienId" value={currentJanjiFormData.pasienId || ''} onChange={handleJanjiFormChange} required className={lightInputBaseClass}> <option value="" disabled>-- Pasien --</option> {dummyPasienList.filter(p=>p.status==='Aktif').map(p=><option key={p.id} value={p.id}>{p.nama} ({p.noRM})</option>)} </select> </div>
                    <div> <label className={`block text-sm font-medium mb-1 ${secondaryDarkTextColor}`}>Pilih Dokter <span className="text-red-500">*</span></label> <select name="dokterId" value={currentJanjiFormData.dokterId || ''} onChange={handleJanjiFormChange} required className={lightInputBaseClass}> <option value="" disabled>-- Dokter --</option> {dummyDokterList.filter(d=>d.status==='Aktif').map(d=><option key={d.id} value={d.id}>{d.nama} ({d.keahlian})</option>)} </select> </div>
                    <div><label className={`block text-sm font-medium mb-1 ${secondaryDarkTextColor}`}>Tanggal & Waktu <span className="text-red-500">*</span></label><input type="datetime-local" name="tanggalWaktu" value={currentJanjiFormData.tanggalWaktu ? new Date(currentJanjiFormData.tanggalWaktu.getTime() - currentJanjiFormData.tanggalWaktu.getTimezoneOffset() * 60000).toISOString().slice(0, 16) : ''} onChange={handleJanjiFormChange} required className={`${lightInputBaseClass}`} /></div>
                    <div> <label className={`block text-sm font-medium mb-1 ${secondaryDarkTextColor}`}>Status Janji <span className="text-red-500">*</span></label> <select name="status" value={currentJanjiFormData.status || 'Terjadwal'} onChange={handleJanjiFormChange} className={lightInputBaseClass}> <option value="Terjadwal">Terjadwal</option> <option value="Menunggu Konfirmasi">Menunggu Konfirmasi</option> </select> </div>
                    <div className="md:col-span-2"><label className={`block text-sm font-medium mb-1 ${secondaryDarkTextColor}`}>Keluhan Singkat <span className="text-red-500">*</span></label><textarea name="keluhan" value={currentJanjiFormData.keluhan || ''} onChange={handleJanjiFormChange} rows={3} required className={lightInputBaseClass}></textarea></div>
                 </div>
                <div className="pt-5 flex justify-end gap-3 border-t border-gray-200 mt-6"> <button type="button" onClick={() => setShowBuatJanjiModal(false)} className={adminSecondaryButtonClass}>Batal</button> <button type="submit" className={adminPrimaryButtonClass}>Simpan Janji Temu</button> </div>
            </form>
        </Modal>

        <Modal title={`Detail Dokter: ${showDetailDokter?.nama || 'Dokter'}`} show={!!showDetailDokter} onClose={() => setShowDetailDokter(null)}> {showDetailDokter && ( <div className={`space-y-3 text-sm ${primaryDarkTextColor}`}> <div className="flex items-center gap-4 mb-4"> {showDetailDokter.avatar ? <img src={showDetailDokter.avatar} alt={showDetailDokter.nama} className="w-20 h-20 rounded-full object-cover border-2 border-gray-300 shadow-md"/> : <UserCircleIcon className="w-20 h-20 text-gray-400"/> } <div> <h4 className={`text-xl font-semibold ${primaryDarkTextColor}`}>{showDetailDokter.nama}</h4> <p className={`${subtleDarkTextColor}`}>{showDetailDokter.keahlian}</p> </div> </div> <p><strong className={secondaryDarkTextColor}>NIK:</strong> {showDetailDokter.nik}</p> <p><strong className={secondaryDarkTextColor}>No. STR:</strong> {showDetailDokter.noSTR}</p> <p><strong className={secondaryDarkTextColor}>Status:</strong> <span className={`ml-2 px-2 py-0.5 text-xs font-medium rounded-full ${showDetailDokter.status === 'Aktif' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{showDetailDokter.status}</span> </p> <p><strong className={secondaryDarkTextColor}>Email:</strong> {showDetailDokter.email}</p> <p><strong className={secondaryDarkTextColor}>Telepon:</strong> {showDetailDokter.telepon}</p> <p><strong className={secondaryDarkTextColor}>Tgl. Bergabung:</strong> {new Date(showDetailDokter.tanggalBergabung).toLocaleDateString('id-ID', {dateStyle:'long'})}</p> <div className="pt-5 flex justify-end border-t border-gray-200 mt-6"> <button onClick={() => setShowDetailDokter(null)} className={adminPrimaryButtonClass}>Tutup</button> </div> </div> )} </Modal>
        <Modal title={`Detail Pasien: ${showDetailPasien?.nama || 'Pasien'}`} show={!!showDetailPasien} onClose={() => setShowDetailPasien(null)}> {showDetailPasien && ( <div className={`space-y-3 text-sm ${primaryDarkTextColor}`}> <div className="flex items-center gap-4 mb-4"> {showDetailPasien.avatar ? <img src={showDetailPasien.avatar} alt={showDetailPasien.nama} className="w-20 h-20 rounded-full object-cover border-2 border-gray-300 shadow-md"/> : <UserCircleIcon className="w-20 h-20 text-gray-400"/> } <div> <h4 className={`text-xl font-semibold ${primaryDarkTextColor}`}>{showDetailPasien.nama}</h4> <p className={`${subtleDarkTextColor}`}>No. RM: {showDetailPasien.noRM}</p> </div> </div> <p><strong className={secondaryDarkTextColor}>Tgl Lahir:</strong> {new Date(showDetailPasien.tanggalLahir).toLocaleDateString('id-ID', {dateStyle:'long'})}</p> <p><strong className={secondaryDarkTextColor}>Jenis Kelamin:</strong> {showDetailPasien.jenisKelamin}</p> <p><strong className={secondaryDarkTextColor}>Status:</strong> <span className={`ml-2 px-2 py-0.5 text-xs font-medium rounded-full ${showDetailPasien.status === 'Aktif' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{showDetailPasien.status}</span> </p> <p><strong className={secondaryDarkTextColor}>Telepon:</strong> {showDetailPasien.telepon}</p> {showDetailPasien.email && <p><strong className={secondaryDarkTextColor}>Email:</strong> {showDetailPasien.email}</p>} <p><strong className={secondaryDarkTextColor}>Alamat:</strong> {showDetailPasien.alamat}</p> <p><strong className={secondaryDarkTextColor}>Tgl. Registrasi:</strong> {new Date(showDetailPasien.tanggalRegistrasi).toLocaleDateString('id-ID', {dateStyle:'long'})}</p> <div className="pt-5 flex justify-end border-t border-gray-200 mt-6"> <button onClick={() => setShowDetailPasien(null)} className={adminPrimaryButtonClass}>Tutup</button> </div> </div> )} </Modal>
        <Footer />
    </main>
  );
}

export default AdminDashboardPageContent;