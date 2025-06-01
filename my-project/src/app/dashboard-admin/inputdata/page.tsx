// misal: app/input-data/page.tsx
"use client";

import Navbar from './sections/navbar'; // Sesuaikan path jika Navbar ada di direktori berbeda
import Footer from './sections/footer'; // Sesuaikan path jika Footer ada di direktori berbeda
import React, { useState, FormEvent, ChangeEvent, useEffect } from 'react';
import { ArrowRightIcon, DocumentPlusIcon, CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'; //gunakan DocumentPlusIcon untuk submit

// --- Komponen Styling Umum (Dapat diimpor dari file shared/utils jika ada) ---
const FloatingGeometricShapes: React.FC<{ shapeClassName?: string; count?: number; className?: string }> = ({ shapeClassName = "bg-[#A0D0D5]/5", count = 15, className = "" }) => (
  <div className={`absolute inset-0 overflow-hidden -z-10 ${className}`}>
    {[...Array(count)].map((_, i) => {
      const size = Math.random() * 70 + 30;
      const type = Math.random();
      return (
        <div key={i} className={`absolute ${shapeClassName} animate-float`} style={{
            width: `${size}px`, height: `${size}px`, left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 8}s`, animationDuration: `${Math.random() * 20 + 15}s`,
            opacity: Math.random() * 0.08 + 0.02,
            clipPath: type < 0.33 ? 'circle(50%)' : (type < 0.66 ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)')
          }} />
      );
    })}
  </div>
);

interface FadeInUpProps { children: React.ReactNode; delay?: string; duration?: string; className?: string; }
const FadeInUp: React.FC<FadeInUpProps> = ({ children, delay = '', duration = 'duration-700', className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => { setIsVisible(true); }, []);
  return ( <div className={`transition-all ease-out ${duration} ${delay} ${className} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>{children}</div> );
};

const darkBluePageGradient = "bg-gradient-to-br from-[#1A0A3B] via-[#1E47A0] to-[#123A7A]";
const whiteBoxClass = "bg-white/90 backdrop-blur-xl shadow-2xl rounded-2xl p-6 md:p-10 border border-white/20"; // p-10 agar lebih luas
const primaryDarkTextColor = "text-[#1A0A3B]";
const secondaryDarkTextColor = "text-[#1E47A0]";
const subtleDarkTextColor = "text-gray-700"; // Sedikit lebih gelap dari gray-600
const lightInputBaseClass = `w-full bg-gray-50 border border-gray-300 ${primaryDarkTextColor} placeholder-gray-400 rounded-xl p-3 py-2.5 focus:ring-2 focus:ring-[#1E47A0] focus:border-[#1E47A0] transition-colors text-sm shadow-sm`;
// --- Akhir Komponen Styling Umum ---

interface BaseField {
  name: keyof FormData; // Memastikan nama field cocok dengan kunci di FormData
  label: string;
  required: boolean;
  span: string;
}

interface TextField extends BaseField {
  type: "text" | "password" | "email" | "date" | "datetime-local"; // Tambahkan tipe input teks lainnya
  placeholder?: string; // Placeholder opsional untuk input teks
  step?: never; // Tidak ada step untuk tipe ini
  rows?: never; // Tidak ada rows untuk tipe ini
  options?: never; // Tidak ada options untuk tipe ini
}

interface NumberField extends BaseField {
  type: "number";
  placeholder?: string; // Placeholder opsional untuk input angka
  step?: string; // Step khusus untuk number input
  rows?: never;
  options?: never;
}

interface TextAreaField extends BaseField {
  type: "textarea";
  rows: number;
  placeholder?: string; // Placeholder opsional untuk textarea
  step?: never;
  options?: never;
}

interface SelectField extends BaseField {
  type: "select";
  options: string[];
  placeholder?: never; // Tidak ada placeholder untuk select
  step?: never;
  rows?: never;
}

// Gabungkan semua tipe field ke dalam satu union type
type FormFieldConfig = TextField | NumberField | TextAreaField | SelectField;


interface FormData {
  id_kunjungan_pasien: string;
  id_pasien_internal: string;
  id_faskes: string;
  tanggal_jam_kunjungan: string;
  tempat_lahir: string; // Dipisah
  tanggal_lahir: string; // Dipisah
  jenis_kelamin_pasien: string;
  domisili_pasien: string;
  keluhan_utama_pasien: string;
  gejala_fisik_dialami: string;
  tanggal_onset_gejala_pertama: string;
  suhu_tubuh: string;
  dugaan_penyakit: string;
  riwayat_penyakit_penyerta_komorbid: string;
  status_vaksinasi: string;
  riwayat_perjalanan_14_hari_terakhir: string;
  hasil_pemeriksaan_penunjang_kunci: string;
  tindakan_yang_diberikan: string;
  status_akhir_pasien: string;
}



const initialFormData: FormData = {
  id_kunjungan_pasien: "", id_pasien_internal: "", id_faskes: "", tanggal_jam_kunjungan: "",
  tempat_lahir: "", tanggal_lahir: "", jenis_kelamin_pasien: "Laki-laki", domisili_pasien: "",
  keluhan_utama_pasien: "", gejala_fisik_dialami: "", tanggal_onset_gejala_pertama: "",
  suhu_tubuh: "", dugaan_penyakit: "", riwayat_penyakit_penyerta_komorbid: "",
  status_vaksinasi: "Belum Vaksin", riwayat_perjalanan_14_hari_terakhir: "",
  hasil_pemeriksaan_penunjang_kunci: "", tindakan_yang_diberikan: "", status_akhir_pasien: "Pulang",
};

// Konfigurasi field form untuk rendering dinamis
const formFieldsConfig: FormFieldConfig[] = [
  { name: "id_kunjungan_pasien", label: "ID Kunjungan Pasien", type: "text", required: true, span: "md:col-span-1", placeholder: "Contoh: KUNJ001" }, // Tambahkan placeholder
  { name: "id_pasien_internal", label: "ID Pasien Internal", type: "text", required: false, span: "md:col-span-1", placeholder: "Opsional" }, // Tambahkan placeholder
  { name: "id_faskes", label: "ID Faskes", type: "text", required: true, span: "md:col-span-1", placeholder: "Contoh: FASKES001" }, // Tambahkan placeholder
  { name: "tanggal_jam_kunjungan", label: "Tgl & Jam Kunjungan", type: "datetime-local", required: true, span: "md:col-span-1" },
  { name: "tempat_lahir", label: "Tempat Lahir", type: "text", required: true, span: "md:col-span-1", placeholder: "Contoh: Jakarta" }, // Tambahkan placeholder
  { name: "tanggal_lahir", label: "Tanggal Lahir", type: "date", required: true, span: "md:col-span-1" },
  { name: "jenis_kelamin_pasien", label: "Jenis Kelamin Pasien", type: "select", required: true, options: ["Laki-laki", "Perempuan"], span: "md:col-span-1" },
  { name: "domisili_pasien", label: "Domisili (Kelurahan/Desa)", type: "text", required: true, span: "md:col-span-1", placeholder: "Contoh: Kebayoran Baru" }, // Tambahkan placeholder
  { name: "keluhan_utama_pasien", label: "Keluhan Utama Pasien", type: "textarea", required: true, rows: 3, span: "md:col-span-2", placeholder: "Jelaskan keluhan utama pasien..." }, // Tambahkan placeholder
  { name: "gejala_fisik_dialami", label: "Gejala Fisik Dialami", type: "textarea", required: true, rows: 3, span: "md:col-span-2", placeholder: "Jelaskan gejala fisik yang dialami..." }, // Tambahkan placeholder
  { name: "tanggal_onset_gejala_pertama", label: "Tgl Onset Gejala Pertama", type: "date", required: true, span: "md:col-span-1" },
  { name: "suhu_tubuh", label: "Suhu Tubuh (°C)", type: "number", required: true, step: "0.1", span: "md:col-span-1", placeholder: "Contoh: 37.5" }, // Tambahkan placeholder
  { name: "dugaan_penyakit", label: "Dugaan Penyakit", type: "text", required: true, span: "md:col-span-2", placeholder: "Contoh: Demam Berdarah" }, // Tambahkan placeholder
  { name: "riwayat_penyakit_penyerta_komorbid", label: "Riwayat Penyakit Penyerta/Komorbid", type: "textarea", required: false, rows: 2, span: "md:col-span-2", placeholder: "Opsional. Contoh: Hipertensi, Diabetes" }, // Tambahkan placeholder
  { name: "status_vaksinasi", label: "Status Vaksinasi", type: "select", required: true, options: ["Belum Vaksin", "Dosis 1", "Dosis 2", "Booster 1", "Booster 2", "Lengkap (Booster 2+)"], span: "md:col-span-1" },
  { name: "status_akhir_pasien", label: "Status Akhir Pasien", type: "select", required: true, options: ["Pulang", "Rawat Inap", "Rujuk", "Isolasi Mandiri", "Meninggal", "Lainnya"], span: "md:col-span-1" },
  { name: "riwayat_perjalanan_14_hari_terakhir", label: "Riwayat Perjalanan 14 Hari Terakhir", type: "textarea", required: true, rows: 2, span: "md:col-span-2", placeholder: "Sebutkan kota/negara yang dikunjungi..." }, // Tambahkan placeholder
  { name: "hasil_pemeriksaan_penunjang_kunci", label: "Hasil Pemeriksaan Penunjang Kunci", type: "textarea", required: false, rows: 2, span: "md:col-span-2", placeholder: "Opsional. Contoh: Hasil Rapid Antigen Positif" }, // Tambahkan placeholder
  { name: "tindakan_yang_diberikan", label: "Tindakan yang Diberikan", type: "textarea", required: true, rows: 3, span: "md:col-span-2", placeholder: "Contoh: Pemberian paracetamol, istirahat" }, // Tambahkan placeholder
];


const InputDataPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{type: 'success' | 'error'; text: string} | null>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (submitMessage) setSubmitMessage(null); // Clear message on new input
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage(null);
    console.log("Data yang disubmit:", formData);

    // Simulasi proses submit
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Contoh hasil submit (ganti dengan logika API call Anda)
    const isSuccess = Math.random() > 0.2; // 80% chance of success for demo
    if (isSuccess) {
      setSubmitMessage({type: 'success', text: 'Data berhasil disimpan!'});
      setFormData(initialFormData); // Reset form on success
    } else {
      setSubmitMessage({type: 'error', text: 'Gagal menyimpan data. Silakan coba lagi.'});
    }
    setIsSubmitting(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className={`flex-1 ${darkBluePageGradient} relative selection:bg-[#A0D0D5] selection:text-[#1A0A3B] py-12 md:py-16`}>
        <FloatingGeometricShapes shapeClassName="bg-[#A0D0D5]/10" count={20} />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInUp>
            <h1 className={`text-4xl md:text-5xl pt-20 font-bold text-white mb-10 text-center tracking-tight`}>Formulir Input Data Kunjungan</h1>
          </FadeInUp>

          <FadeInUp delay="delay-[100ms]" className={whiteBoxClass}>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                {formFieldsConfig.map(field => (
                  <div key={field.name} className={field.span || "md:col-span-1"}>
                    <label htmlFor={field.name} className={`block text-sm font-medium mb-1.5 ${secondaryDarkTextColor}`}>
                      {field.label}
                      {field.required && <span className="text-red-500 ml-0.5">*</span>}
                    </label>
                    {field.type === 'textarea' ? (
                      <textarea
                        id={field.name}
                        name={field.name}
                        rows={field.rows || 3}
                        value={formData[field.name as keyof FormData]}
                        onChange={handleInputChange}
                        required={field.required}
                        className={lightInputBaseClass}
                        placeholder={field.placeholder || ''}
                      />
                    ) : field.type === 'select' ? (
                      <select
                        id={field.name}
                        name={field.name}
                        value={formData[field.name as keyof FormData]}
                        onChange={handleInputChange}
                        required={field.required}
                        className={lightInputBaseClass}
                      >
                        {field.options?.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={field.type}
                        id={field.name}
                        name={field.name}
                        value={formData[field.name as keyof FormData]}
                        onChange={handleInputChange}
                        required={field.required}
                        step={field.type === 'number' ? field.step : undefined}
                        className={lightInputBaseClass}
                        placeholder={field.placeholder || ''}
                      />
                    )}
                  </div>
                ))}
              </div>

              {submitMessage && (
                <div className={`p-4 rounded-md text-sm font-medium flex items-center gap-2
                  ${submitMessage.type === 'success' ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'}`}
                >
                  {submitMessage.type === 'success' ? <CheckCircleIcon className="w-5 h-5"/> : <ExclamationTriangleIcon className="w-5 h-5"/>}
                  {submitMessage.text}
                </div>
              )}

              <div className="pt-6 border-t border-gray-200 flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-semibold py-3 px-8 rounded-xl shadow-lg transform transition-all duration-150 ease-in-out flex items-center justify-center gap-2.5
                    ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Memproses...
                    </>
                  ) : (
                    <>
                      <DocumentPlusIcon className="w-5 h-5" />
                      Submit Data
                    </>
                  )}
                </button>
              </div>
            </form>
          </FadeInUp>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default InputDataPage;