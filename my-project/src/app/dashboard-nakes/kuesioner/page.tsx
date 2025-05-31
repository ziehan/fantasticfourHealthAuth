// app/log-harian-nakes/page.tsx atau pages/log-harian-nakes.tsx
"use client";

// PASTIKAN PATH INI BENAR SESUAI STRUKTUR PROYEK ANDA
// Jika Navbar/Footer ada di components/sections di root: import Navbar from '@/components/sections/navbar';
// Jika ada di app/components/sections: import Navbar from '@/app/components/sections/navbar';
import Navbar from './sections/navbar';
import Footer from './sections/footer';

import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation'; // Ditambahkan untuk navigasi
import {
  CalendarDaysIcon,
  ClockIcon,
  UserGroupIcon,
  SparklesIcon,
  MoonIcon,
  BoltIcon,
  FaceSmileIcon,
  ExclamationTriangleIcon,
  QuestionMarkCircleIcon,
  HeartIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';

const FadeInUp: React.FC<{ children: React.ReactNode, delay?: string, className?: string }> = ({ children, delay = '', className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);
  return (
    <div className={`transition-all duration-700 ease-out ${delay} ${className} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      {children}
    </div>
  );
};

interface Option {
  value: string;
  label: string;
}

interface QuestionProps {
  id: string;
  label: string;
  description?: string;
  options: Option[];
  type: 'radio' | 'checkbox' | 'scale';
  currentValue: string | string[];
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  icon?: React.ElementType;
}

const QuestionGroup: React.FC<QuestionProps> = ({ id, label, description, options, type, currentValue, onChange, icon: Icon }) => {
  return (
    <FadeInUp className="mb-8 last:mb-0">
      <label className="block text-lg font-semibold text-[#1A0A3B] mb-1">
        {Icon && <Icon className="inline-block w-6 h-6 mr-2 mb-0.5 text-[#1E47A0]" />}
        {label}
      </label>
      {description && <p className="text-sm text-[#1A0A3B]/80 mb-3">{description}</p>}
      <div className={`grid ${type === 'checkbox' || options.length > 4 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'} gap-x-6 gap-y-4`}>
        {options.map((option) => (
          <label key={option.value} htmlFor={`${id}-${option.value}`} className="flex items-center space-x-3 p-3.5 border border-[#A0D0D5]/70 rounded-lg hover:border-[#1E47A0] hover:bg-[#E0F2F3]/70 transition-all cursor-pointer shadow-sm hover:shadow-md">
            <input
              id={`${id}-${option.value}`}
              type={type === 'checkbox' ? 'checkbox' : 'radio'}
              name={id}
              value={option.value}
              checked={type === 'checkbox' ? (currentValue as string[]).includes(option.value) : currentValue === option.value}
              onChange={onChange}
              className="hidden peer"
            />
            <span className={`w-5 h-5 border-2 ${type === 'checkbox' ? 'rounded-md' : 'rounded-full'} border-[#A0D0D5] flex items-center justify-center transition-colors duration-200 peer-checked:bg-[#1E47A0] peer-checked:border-[#1E47A0]`}>
              {type === 'checkbox' && (currentValue as string[]).includes(option.value) && <CheckIcon className="w-3.5 h-3.5 text-white" />}
              {type === 'radio' && currentValue === option.value && <span className="w-2.5 h-2.5 bg-white rounded-full"></span>}
            </span>
            <span className="text-sm text-[#1A0A3B] peer-checked:font-semibold">{option.label}</span>
          </label>
        ))}
      </div>
    </FadeInUp>
  );
};

interface FormData {
  shiftKerja: string;
  jamKerja: string;
  rasioNakesPasien: string;
  istirahatCukup: string;
  kualitasTidur: string;
  tingkatEnergi: string;
  kondisiEmosional: string;
  rasaTerburuBuru: string;
  gejalaFisik: string[];
  dukunganRekanKerja: string;
  waktuPribadi: string;
  tingkatStresPekerjaan: string;
  butuhBantuan: string;
  upayaJagaKesehatan: string;
}

const LogHarianNakesPage: React.FC = () => {
  const router = useRouter(); // Ditambahkan untuk navigasi
  const initialFormData: FormData = {
    shiftKerja: '', jamKerja: '', rasioNakesPasien: '', istirahatCukup: '', kualitasTidur: '',
    tingkatEnergi: '', kondisiEmosional: '', rasaTerburuBuru: '', gejalaFisik: [], dukunganRekanKerja: '',
    waktuPribadi: '', tingkatStresPekerjaan: '', butuhBantuan: '', upayaJagaKesehatan: '',
  };
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    setCurrentDate(new Date().toLocaleDateString('id-ID', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' }));
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => {
        const list = (prev[name as keyof FormData] as string[]) || [];
        if (checked) {
          if (value === "Tidak Ada Keluhan") {
            return { ...prev, [name]: [value] };
          }
          const newList = list.filter(item => item !== "Tidak Ada Keluhan");
          return { ...prev, [name]: [...newList, value] };
        } else {
          return { ...prev, [name]: list.filter(item => item !== value) };
        }
      });
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log("Log Harian Nakes Disubmit:", formData);
    alert("Log harian berhasil dikirim! (Data di console)"); // Alert yang sudah ada dipertahankan
    // setFormData(initialFormData); // Reset form, bisa dipertimbangkan apakah perlu sebelum redirect

    // Navigasi ke halaman dashboard-nakes
    // Pastikan '/dashboard-nakes' adalah path yang benar sesuai struktur routing Anda
    router.push('/dashboard-nakes');
  };

  const sectionTitleClass = "text-xl sm:text-2xl font-bold text-[#1A0A3B] mb-6 pb-3 border-b-2 border-[#A0D0D5]/50 flex items-center";
  const pageBackgroundGradient = "bg-gradient-to-br from-[#1A0A3B] via-[#1E47A0] to-[#123A7A]";

  return (
    <div className={`min-h-screen ${pageBackgroundGradient} flex flex-col`}>
      <Navbar />
      <main className="flex-grow flex flex-col items-center pt-24 sm:pt-28 pb-8 sm:pb-12 px-4 sm:px-6 lg:px-8">
        <FadeInUp className="w-full max-w-4xl" delay="delay-[100ms]">
          <header className="text-center mb-10 md:mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#E0F2F3] tracking-tight">Log Harian Nakes</h1>
            <p className="mt-3 text-md sm:text-lg text-[#A0D0D5]">Update kondisi dan aktivitas kerjamu hari ini.</p>
          </header>

          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 md:p-10">
            {/* --- Bagian 1: Log Harian Aktivitas Kerja --- */}
            <section className="mb-10 md:mb-12">
              <h2 className={sectionTitleClass}>
                <ClockIcon className="w-7 h-7 mr-3 text-[#1E47A0]" />1. Log Harian Aktivitas Kerja
              </h2>
              <div className="bg-[#E0F2F3] border border-[#A0D0D5] text-[#1A0A3B] px-4 py-3.5 rounded-lg mb-8 text-sm flex items-center shadow-sm">
                <CalendarDaysIcon className="w-5 h-5 mr-2.5 text-[#1E47A0]" />
                Tanggal Pengisian: <span className="font-semibold ml-1.5">{currentDate}</span> (Otomatis terisi)
              </div>

              <QuestionGroup id="shiftKerja" label="Shift Kerja Hari Ini" options={[
                { value: 'pagi', label: 'Pagi' }, { value: 'siang', label: 'Siang' },
                { value: 'malam', label: 'Malam' }, { value: 'lepas_jaga_libur', label: 'Lepas Jaga / Libur' }
              ]} type="radio" currentValue={formData.shiftKerja} onChange={handleChange} />

              <QuestionGroup id="jamKerja" label="Total jam kerja pada shift tersebut (termasuk lembur)?" options={[
                { value: '<8jam', label: '< 8 jam' }, { value: '8-10jam', label: '8-10 jam' },
                { value: '10-12jam', label: '10-12 jam' }, { value: '>12jam', label: '> 12 jam' }
              ]} type="radio" currentValue={formData.jamKerja} onChange={handleChange} />

              <QuestionGroup id="rasioNakesPasien" label="Rasio nakes dengan pasien yang Anda tangani/awasi shift terakhir?" options={[
                { value: 'ideal', label: 'Ideal' }, { value: 'cukup', label: 'Cukup' },
                { value: 'kurang', label: 'Kurang' }, { value: 'sangat_kurang', label: 'Sangat Kurang' }
              ]} type="radio" currentValue={formData.rasioNakesPasien} onChange={handleChange} />

              <QuestionGroup id="istirahatCukup" label="Selama bekerja, apakah Anda mendapatkan istirahat yang cukup?" description="(Min. 30 menit di sela jam kerja, tidak termasuk istirahat makan)" options={[
                { value: 'selalu', label: 'Ya, selalu' }, { value: 'sering', label: 'Sering' },
                { value: 'kadang', label: 'Kadang-kadang' }, { value: 'jarang', label: 'Jarang' }, { value: 'tidak_pernah', label: 'Tidak pernah' }
              ]} type="radio" currentValue={formData.istirahatCukup} onChange={handleChange} />
            </section>

            {/* --- Bagian 2: Self-Assessment Kondisi Diri --- */}
            <section>
              <h2 className={sectionTitleClass}>
                <SparklesIcon className="w-7 h-7 mr-3 text-[#1E47A0]" />2. Self-Assessment Kondisi Diri
              </h2>

              <QuestionGroup id="kualitasTidur" label="Kualitas tidur Anda tadi malam / sebelum shift?" icon={MoonIcon} options={[
                { value: 'sangat_baik', label: 'Sangat Baik (7-8 jam, nyenyak)' }, { value: 'baik', label: 'Baik (6-7 jam, cukup nyenyak)' },
                { value: 'kurang_baik', label: 'Kurang Baik (4-5 jam, sering bangun)' }, { value: 'buruk', label: 'Buruk (<4 jam, tidak nyenyak)' }
              ]} type="radio" currentValue={formData.kualitasTidur} onChange={handleChange} />

              <QuestionGroup id="tingkatEnergi" label="Tingkat energi/stamina Anda saat ini?" icon={BoltIcon} description="(1 = Sangat Rendah, 5 = Sangat Tinggi)" options={[
                { value: '1', label: '1' }, { value: '2', label: '2' }, { value: '3', label: '3' }, { value: '4', label: '4' }, { value: '5', label: '5' }
              ]} type="radio" currentValue={formData.tingkatEnergi} onChange={handleChange} />

              <QuestionGroup id="kondisiEmosional" label="Kondisi emosional Anda (24 jam terakhir)?" icon={FaceSmileIcon} options={[
                { value: 'tenang_optimis', label: 'Tenang dan Optimis' }, { value: 'sedikit_cemas', label: 'Sedikit Cemas / Tertekan' },
                { value: 'cukup_stres', label: 'Cukup Stres / Mudah Marah' }, { value: 'sangat_stres', label: 'Sangat Stres / Kewalahan' }, { value: 'sedih_hilang_minat', label: 'Sedih / Kehilangan Minat' }
              ]} type="radio" currentValue={formData.kondisiEmosional} onChange={handleChange} />

              <QuestionGroup id="rasaTerburuBuru" label="Seberapa sering merasa terburu-buru atau tertekan oleh pekerjaan?" options={[
                { value: 'sangat_sering', label: 'Sangat Sering' }, { value: 'sering', label: 'Sering' },
                { value: 'kadang', label: 'Kadang-kadang' }, { value: 'jarang', label: 'Jarang' }, { value: 'tidak_pernah', label: 'Tidak Pernah' }
              ]} type="radio" currentValue={formData.rasaTerburuBuru} onChange={handleChange} />

              <QuestionGroup id="gejalaFisik" label="Gejala fisik tidak biasa (24 jam terakhir)?" description="(Pilih semua yang sesuai)" options={[
                { value: 'sakit_kepala', label: 'Sakit Kepala / Pusing' }, { value: 'nyeri_otot', label: 'Nyeri Otot / Sendi' },
                { value: 'kelelahan_berlebih', label: 'Kelelahan Berlebih' }, { value: 'gangguan_pencernaan', label: 'Gangguan Pencernaan' },
                { value: 'jantung_berdebar', label: 'Jantung Berdebar' }, { value: 'sulit_tidur', label: 'Sulit Tidur (Insomnia)' },
                { value: 'Tidak Ada Keluhan', label: 'Tidak Ada Keluhan' }
              ]} type="checkbox" currentValue={formData.gejalaFisik} onChange={handleChange} />

              <QuestionGroup id="dukunganRekanKerja" label="Dukungan dari rekan kerja & atasan?" icon={UserGroupIcon} description="(1 = Sangat Tidak Mendukung, 5 = Sangat Mendukung)" options={[
                { value: '1', label: '1' }, { value: '2', label: '2' }, { value: '3', label: '3' }, { value: '4', label: '4' }, { value: '5', label: '5' }
              ]} type="radio" currentValue={formData.dukunganRekanKerja} onChange={handleChange} />

              <QuestionGroup id="waktuPribadi" label="Waktu cukup untuk aktivitas pribadi/relaksasi di luar jam kerja?" options={[
                { value: 'sangat_cukup', label: 'Ya, sangat cukup' }, { value: 'cukup', label: 'Cukup' },
                { value: 'kurang', label: 'Kurang' }, { value: 'sangat_kurang', label: 'Sangat Kurang / Tidak Ada' }
              ]} type="radio" currentValue={formData.waktuPribadi} onChange={handleChange} />

              <QuestionGroup id="tingkatStresPekerjaan" label="Tingkat stres Anda terkait pekerjaan saat ini?" icon={ExclamationTriangleIcon} options={[
                { value: 'sangat_rendah', label: 'Sangat Rendah' }, { value: 'rendah', label: 'Rendah' },
                { value: 'sedang', label: 'Sedang' }, { value: 'tinggi', label: 'Tinggi' }, { value: 'sangat_tinggi', label: 'Sangat Tinggi' }
              ]} type="radio" currentValue={formData.tingkatStresPekerjaan} onChange={handleChange} />

              <QuestionGroup id="butuhBantuan" label="Merasa butuh bantuan/dukungan lebih lanjut terkait kondisi fisik/mental?" icon={QuestionMarkCircleIcon} options={[
                { value: 'ya_sangat', label: 'Ya, sangat membutuhkan' }, { value: 'ya_mungkin', label: 'Ya, mungkin membutuhkan' },
                { value: 'ragu', label: 'Belum tahu / Ragu-ragu' }, { value: 'tidak_baik', label: 'Tidak, merasa baik-baik saja' }, { value: 'tidak_sendiri', label: 'Tidak, bisa mengatasi sendiri' }
              ]} type="radio" currentValue={formData.butuhBantuan} onChange={handleChange} />

              <QuestionGroup id="upayaJagaKesehatan" label="Sudah melakukan upaya menjaga kesehatan fisik & mental belakangan ini?" icon={HeartIcon} options={[
                { value: 'ya_rutin', label: 'Ya, rutin dan terstruktur' }, { value: 'ya_kadang', label: 'Ya, kadang-kadang' },
                { value: 'berencana', label: 'Baru berencana' }, { value: 'belum_sempat', label: 'Belum sempat / Tidak tahu caranya' }, { value: 'tidak_perlu', label: 'Merasa tidak perlu' }
              ]} type="radio" currentValue={formData.upayaJagaKesehatan} onChange={handleChange} />
            </section>

            <FadeInUp delay="delay-[300ms]" className="mt-10 pt-8 border-t border-[#A0D0D5]/30 text-center">
              <button
                type="submit" // type="submit" akan memicu form onSubmit
                // onClick yang sebelumnya salah telah dihapus dari sini
                className="bg-gradient-to-r from-[#1E47A0] to-[#123A7A] text-[#E0F2F3] font-bold py-3.5 px-14 rounded-lg shadow-xl hover:scale-105 hover:bg-gradient-to-r hover:from-[#A0D0D5] hover:to-[#c3e4e7] hover:text-[#1A0A3B] transition-all duration-300 ease-in-out text-lg focus:outline-none focus:ring-4 focus:ring-[#A0D0D5]/50"
              >
                Kirim Log Harian
              </button>
            </FadeInUp>
          </form>
        </FadeInUp>
      </main>
      <Footer />
    </div>
  );
};

export default LogHarianNakesPage;