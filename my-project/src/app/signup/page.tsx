"use client";

import { FormEvent, useState, useEffect, useMemo } from "react";
import AddressDropdown from "@/components/AddressDropdown"; // Pastikan path komponen ini benar
import { supabase } from "@/lib/supabase";
import { EyeIcon, EyeSlashIcon, CheckCircleIcon, XCircleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

// --- Komponen FloatingGeometricShapes (dari STYLING HACKATHON) ---
const FloatingGeometricShapes: React.FC<{ shapeClassName?: string; count?: number; className?: string }> = ({ shapeClassName = "bg-white/5", count = 10, className = "" }) => (
  <div className={`absolute inset-0 overflow-hidden -z-10 ${className}`}>
    {[...Array(count)].map((_, i) => {
      const size = Math.random() * 60 + 30;
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
            opacity: Math.random() * 0.08 + 0.02,
            clipPath: type < 0.33 ? 'circle(50%)' : (type < 0.66 ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)')
          }}
        />
      );
    })}
  </div>
);

// --- Tipe dan Fungsi Bantuan untuk Kekuatan Password ---
interface PasswordStrength {
    score: number;
    message: string;
    colorClass: string;
    checks: { length: boolean; lower: boolean; upper: boolean; number: boolean; special: boolean; };
}

function getPasswordStrength(password: string): PasswordStrength {
    const checks = {
        length: password.length >= 8,
        lower: /[a-z]/.test(password),
        upper: /[A-Z]/.test(password),
        number: /\d/.test(password),
        special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password),
    };
    let score = 0;
    if (checks.length) score++;
    if (checks.lower) score++;
    if (checks.upper) score++;
    if (checks.number) score++;
    if (checks.special) score++;

    let message = "Sangat Lemah";
    // Warna ini akan berfungsi baik di atas latar terang maupun gelap untuk status
    let colorClass = "text-red-600"; 

    if (password.length === 0) {
        message = "";
    } else if (score <= 2) {
        message = "Lemah";
        colorClass = "text-red-600";
    } else if (score === 3) {
        message = "Sedang";
        colorClass = "text-yellow-600";
    } else if (score === 4) {
        message = "Kuat";
        colorClass = "text-green-600";
    } else if (score === 5) {
        message = "Sangat Kuat";
        colorClass = "text-green-700";
    }
    
    if (password.length > 0 && !checks.length) message = "Minimal 8 karakter.";
    
    return { score, message, colorClass, checks };
}

export default function SignupPage() {
    const [formData, setFormData] = useState({
        fullname: "", nik: "", email: "", phone: "", birthDay: "", birthMonth: "", birthYear: "",
        birthPlace: "", password: "", confirmPassword: "", address: "", profession: "",
        province: "", regency: "", district: "", village: "",
    });

    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [cooldown, setCooldown] = useState(false);
    const [cooldownLeft, setCooldownLeft] = useState(50);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const passwordStrength = useMemo(() => getPasswordStrength(formData.password), [formData.password]);

    // --- Styling Konstanta ---
    const darkBluePageGradient = "bg-gradient-to-br from-[#1A0A3B] via-[#1E47A0] to-[#123A7A]";
    
    // Styling untuk Box Putih dengan Blur
    const formContainerClass = "bg-white/90 backdrop-blur-lg shadow-2xl rounded-3xl border border-white/30";

    // Styling untuk elemen form di dalam box putih (kembali ke gaya terang)
    const primaryDarkTextColor = "text-[#1A0A3B]";
    const secondaryDarkTextColor = "text-[#1E47A0]";
    const subtleDarkTextColor = "text-gray-600"; // atau text-[#1E47A0]/80

    const baseInputClass = `w-full px-4 py-3 rounded-xl border bg-white/95 placeholder-gray-400 ${primaryDarkTextColor} focus:outline-none focus:ring-2 shadow-sm transition-colors duration-200 ease-in-out`;
    const validInputClass = `border-gray-300 hover:border-[#A0D0D5] focus:ring-[#1E47A0] focus:border-[#1E47A0]`;
    const selectInputClass = `${baseInputClass} ${validInputClass}`;


    const labelClass = `block text-sm font-medium ${secondaryDarkTextColor} mb-1.5`;
    const fieldsetLegendClass = `text-lg font-semibold ${primaryDarkTextColor} px-2 -ml-2`;
    const fieldsetBorderClass = "border-gray-300/70"; // Border fieldset lebih lembut

    const passwordToggleIconClass = `absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 ${secondaryDarkTextColor}/70 hover:${secondaryDarkTextColor} cursor-pointer`;
    // --- Akhir Styling Konstanta ---

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setError(""); 
        if (successMessage) setSuccessMessage('');
    };

    const isValidPhone = (phone: string) => /^(\+62|0)8[0-9]{8,15}$/.test(phone) && !/[^0-9]/.test(phone.startsWith('+') ? phone.substring(3) : phone.substring(1));
    const isValidNik = (nik: string) => /^[0-9]{16}$/.test(nik);

    const fieldLabels: Record<string, string> = {
        fullname: "Nama Lengkap", nik: "NIK", email: "Email", phone: "Nomor Telepon", password: "Kata Sandi",
        birthPlace: "Tempat Lahir", birthDay: "Tanggal Lahir", birthMonth: "Bulan Lahir", birthYear: "Tahun Lahir",
        confirmPassword: "Konfirmasi Kata Sandi", address: "Alamat Detail", profession: "Profesi",
        province: "Provinsi", regency: "Kabupaten/Kota", district: "Kecamatan", village: "Desa/Kelurahan"
    };

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (cooldown) {
            timer = setInterval(() => setCooldownLeft(prev => prev <= 1 ? (clearInterval(timer), setCooldown(false), 50) : prev - 1), 1000);
        }
        return () => clearInterval(timer);
    }, [cooldown]);

    async function handleSignup(event: React.FormEvent) {
        event.preventDefault();
        setError(''); setSuccessMessage(''); setLoading(true);

        const requiredFields = Object.keys(formData).filter(key => ![/* non-required keys */].includes(key)) as (keyof typeof formData)[];
        const emptyFields = requiredFields.filter(key => !formData[key] || String(formData[key]).trim() === "");

        if (emptyFields.length > 0) {
            setError(`Mohon lengkapi kolom: ${emptyFields.map(key => fieldLabels[key] || key).join(", ")}.`);
            setLoading(false); return;
        }
        if (!isValidNik(formData.nik)) {
            setError("NIK tidak valid. Harus terdiri dari 16 digit angka.");
            setLoading(false); return;
        }
        if (!isValidPhone(formData.phone)) {
            setError("Nomor telepon tidak valid. Format: 08xxxx atau +628xxxx.");
            setLoading(false); return;
        }
        if (passwordStrength.score < 3) {
            setError('Password belum cukup kuat. Pastikan minimal 8 karakter, mengandung huruf kecil, huruf kapital, dan angka. Simbol direkomendasikan.');
            setLoading(false); return;
        }
        if (formData.password !== formData.confirmPassword) {
            setError("Kata sandi dan Konfirmasi Kata Sandi tidak cocok.");
            setLoading(false); return;
        }
        const termsCheckbox = document.getElementById('terms-checkbox') as HTMLInputElement;
        if (!termsCheckbox?.checked) {
            setError('Anda harus menyetujui Syarat & Ketentuan serta Kebijakan Privasi.');
            setLoading(false); return;
        }

        try {
            const { data: authData, error: authError } = await supabase.auth.signUp({ email: formData.email, password: formData.password });
            if (authError) {
                if (authError.message.includes('User already registered') || authError.message.includes('already exists')) setError('Email ini sudah terdaftar.');
                else if (authError.message.includes('For security purposes')) { setCooldown(true); setError(`Terlalu banyak percobaan. Harap tunggu ${cooldownLeft} detik.`); }
                else setError(`Gagal mendaftar: ${authError.message}`);
                setLoading(false); return;
            }
            const user = authData.user;
            if (!user) { setError('Gagal mendapatkan data user.'); setLoading(false); return; }
            
            const profileData = {
                user_id: user.id, email: formData.email, fullname: formData.fullname, nik: formData.nik, phone: formData.phone,
                birth_date: `${formData.birthYear}-${String(formData.birthMonth).padStart(2, '0')}-${String(formData.birthDay).padStart(2, '0')}`,
                birth_place: formData.birthPlace, address_detail: formData.address, province_name: formData.province,
                regency_name: formData.regency, district_name: formData.district, village_name: formData.village,
                profession: formData.profession,
            };
            const { error: profileError } = await supabase.from('profiles').insert(profileData);
            if (profileError) {
                console.error('Profile insert error:', profileError);
                setError(profileError.message.includes('duplicate key') ? 'Data profil dengan NIK ini mungkin sudah ada.' : `Gagal menyimpan profil: ${profileError.message}.`);
                setLoading(false); return;
            }
            setFormData({ fullname: "", nik: "", email: "", phone: "", birthDay: "", birthMonth: "", birthYear: "", birthPlace: "", password: "", confirmPassword: "", address: "", profession: "", province: "", regency: "", district: "", village: "" });
            if (termsCheckbox) termsCheckbox.checked = false;
            setShowPassword(false); setShowConfirmPassword(false);
            setSuccessMessage('Registrasi berhasil! 🎉 Cek email Anda untuk verifikasi.');
        } catch (e: any) {
            console.error('Error:', e); setError('Kesalahan tidak terduga.');
        } finally { setLoading(false); }
    }
    
    return (
        <div className={`min-h-screen flex items-center justify-center overflow-y-auto px-4 py-12 sm:px-6 lg:px-8 ${darkBluePageGradient} selection:bg-[#A0D0D5] selection:text-[#1A0A3B] relative`}>
            <FloatingGeometricShapes shapeClassName="bg-white/10" count={12} /> {/* Bentuk geometris sedikit lebih terlihat */}
            
            <div className={`${formContainerClass} p-6 sm:p-8 md:p-10 w-full max-w-2xl space-y-6 relative z-10`}>
                <div className="text-center">
                    <h1 className={`text-3xl sm:text-4xl font-bold ${primaryDarkTextColor}`}>Buat Akun HealthAuth</h1>
                    <p className={`mt-2 text-sm sm:text-base ${subtleDarkTextColor}`}>
                        Selamat datang! Isi form di bawah untuk mendaftar.
                    </p>
                </div>

                <form className="space-y-5" onSubmit={handleSignup} noValidate>
                    <fieldset className={`space-y-5 p-4 border ${fieldsetBorderClass} rounded-xl shadow-sm`}>
                        <legend className={fieldsetLegendClass}>Data Diri</legend>
                        <div>
                            <label htmlFor="fullname" className={labelClass}>Nama Lengkap (sesuai KTP)</label>
                            <input id="fullname" type="text" name="fullname" placeholder="Nama Lengkap Anda" value={formData.fullname} onChange={handleInputChange} required className={`${baseInputClass} ${validInputClass}`} />
                        </div>
                        <div>
                            <label htmlFor="nik" className={labelClass}>NIK</label>
                            <input id="nik" type="text" name="nik" placeholder="16 digit Nomor Induk Kependudukan" maxLength={16} value={formData.nik} onChange={handleInputChange} required className={`${baseInputClass} ${validInputClass}`} />
                        </div>
                        <div>
                            <label className={labelClass}>Tempat & Tanggal Lahir</label>
                            <div className="grid grid-cols-1 sm:grid-cols-5 gap-x-3 gap-y-4">
                                <input type="text" name="birthPlace" placeholder="Kota Kelahiran" value={formData.birthPlace} onChange={handleInputChange} required className={`${baseInputClass} ${validInputClass} sm:col-span-2`} />
                                <select name="birthDay" value={formData.birthDay} onChange={handleInputChange} required className={`${selectInputClass} sm:col-span-1`}>
                                    <option value="" disabled>Tgl</option>
                                    {[...Array(31)].map((_, i) => <option key={i + 1} value={i + 1}>{i + 1}</option>)}
                                </select>
                                <select name="birthMonth" value={formData.birthMonth} onChange={handleInputChange} required className={`${selectInputClass} sm:col-span-1`}>
                                    <option value="" disabled>Bln</option>
                                    {["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"].map((m, idx) => <option key={idx} value={idx + 1}>{m}</option>)}
                                </select>
                                <select name="birthYear" value={formData.birthYear} onChange={handleInputChange} required className={`${selectInputClass} sm:col-span-1`}>
                                    <option value="" disabled>Thn</option>
                                    {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - 17 - i).map(year => (<option key={year} value={year}>{year}</option>))}
                                </select>
                            </div>
                        </div>
                    </fieldset>

                     <fieldset className={`space-y-5 p-4 border ${fieldsetBorderClass} rounded-xl shadow-sm`}>
                        <legend className={fieldsetLegendClass}>Kontak & Akun</legend>
                        <div>
                            <label htmlFor="email" className={labelClass}>Alamat Email Aktif</label>
                            <input id="email" type="email" name="email" placeholder="cth: nama@domain.com" value={formData.email} onChange={handleInputChange} required className={`${baseInputClass} ${validInputClass}`} />
                        </div>
                        <div>
                            <label htmlFor="phone" className={labelClass}>Nomor Telepon (WhatsApp)</label>
                            <input id="phone" type="tel" name="phone" placeholder="cth: 081234567890" value={formData.phone} onChange={handleInputChange} required className={`${baseInputClass} ${validInputClass}`} />
                        </div>
                        <div className="space-y-1.5">
                            <label htmlFor="password" className={labelClass}>Kata Sandi</label>
                            <div className="relative">
                                <input id="password" type={showPassword ? "text" : "password"} name="password" placeholder="Buat kata sandi yang kuat" value={formData.password} onChange={handleInputChange} required className={`${baseInputClass} ${validInputClass} pr-12`} />
                                <span onClick={() => setShowPassword(!showPassword)} className={passwordToggleIconClass}> {showPassword ? <EyeSlashIcon /> : <EyeIcon />} </span>
                            </div>
                            {formData.password.length > 0 && (
                                <div className={`text-xs flex items-center space-x-2 pl-1 ${passwordStrength.colorClass}`}>
                                    <span>Kekuatan: {passwordStrength.message}</span>
                                </div>
                            )}
                             <p className={`text-xs ${subtleDarkTextColor}/90 pl-1`}>Min. 8 karakter, kombinasi huruf besar-kecil, angka, & simbol.</p>
                        </div>
                        <div>
                            <label htmlFor="confirmPassword" className={labelClass}>Konfirmasi Kata Sandi</label>
                            <div className="relative">
                                <input id="confirmPassword" type={showConfirmPassword ? "text" : "password"} name="confirmPassword" placeholder="Ulangi kata sandi Anda" value={formData.confirmPassword} onChange={handleInputChange} required className={`${baseInputClass} ${validInputClass} pr-12`} />
                                <span onClick={() => setShowConfirmPassword(!showConfirmPassword)} className={passwordToggleIconClass}> {showConfirmPassword ? <EyeSlashIcon /> : <EyeIcon />} </span>
                            </div>
                        </div>
                    </fieldset>
                    
                     <fieldset className={`space-y-5 p-4 border ${fieldsetBorderClass} rounded-xl shadow-sm`}>
                        <legend className={fieldsetLegendClass}>Alamat & Profesi</legend>
                        <div>
                            <label htmlFor="address" className={labelClass}>Alamat Domisili Detail</label>
                            <input id="address" type="text" name="address" placeholder="Cth: Jl. Sehat Selalu No. 1, RT 01/RW 02" value={formData.address} onChange={handleInputChange} required className={`${baseInputClass} ${validInputClass}`} />
                        </div>
                        <div className="space-y-3">
                            <label className={`${labelClass} -mb-1`}>Wilayah Administrasi</label>
                            <AddressDropdown
                                onChange={({ provinceName, regencyName, districtName, villageName }) =>
                                    setFormData((prev) => ({ ...prev, province: provinceName, regency: regencyName, district: districtName, village: villageName }))
                                }
                                selectContainerClassName="space-y-3"
                                selectClassName={`${selectInputClass} mb-3`} // Pastikan AddressDropdown menerima ini
                            />
                             <p className={`text-xs ${subtleDarkTextColor}/90 pl-1`}>Pastikan semua tingkatan alamat terisi.</p>
                        </div>
                        <div>
                            <label htmlFor="profession" className={labelClass}>Profesi</label>
                            <select id="profession" name="profession" value={formData.profession} onChange={handleInputChange} required className={selectInputClass} >
                                <option value="" disabled>Pilih Profesi Anda</option>
                                {[ "Dokter Umum", "Dokter Spesialis", "Perawat", "Bidan", "Apoteker", "Tenaga Teknis Kefarmasian", "Ahli Gizi/Dietisien", "Fisioterapis", "Sanitarian/Kesehatan Lingkungan", "Epidemiolog Kesehatan", "Promotor Kesehatan", "Perekam Medis dan Informasi Kesehatan", "Teknisi Laboratorium Medis", "Radiografer", "Tenaga Kesehatan Lainnya", "Umum/Non Tenaga Kesehatan"
                                ].map(prof => <option key={prof} value={prof}>{prof}</option>)}
                            </select>
                        </div>
                    </fieldset>

                    {/* --- Pesan Alert (Error/Sukses/Cooldown) - Gaya terang --- */}
                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow text-sm flex items-start space-x-2" role="alert">
                            <XCircleIcon className="h-5 w-5 flex-shrink-0 text-red-600"/>
                            <div><strong className="font-bold">Gagal!</strong> <span className="block sm:inline">{error}</span></div>
                        </div>
                    )}
                    {successMessage && (
                        <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-md shadow text-sm flex items-start space-x-2" role="alert">
                            <CheckCircleIcon className="h-5 w-5 flex-shrink-0 text-green-600"/>
                            <div><strong className="font-bold">Berhasil!</strong> <span className="block sm:inline">{successMessage}</span></div>
                        </div>
                    )}
                    {cooldown && !error.includes("Harap tunggu") && ( 
                        <div className="bg-yellow-50 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md shadow text-sm flex items-start space-x-2" role="alert">
                            <InformationCircleIcon className="h-5 w-5 flex-shrink-0 text-yellow-600"/>
                            <p>Harap tunggu <strong>{cooldownLeft} detik</strong> sebelum mencoba mendaftar lagi.</p>
                        </div>
                    )}

                    <div className="flex items-start gap-x-3 pt-3">
                         <input id="terms-checkbox" name="terms" type="checkbox" required 
                               className={`mt-0.5 h-5 w-5 rounded border-gray-400 text-[#1E47A0] focus:ring-2 focus:ring-[#1E47A0]/80 focus:ring-offset-2 focus:ring-offset-white cursor-pointer shadow-sm transition-all`} />
                        <div>
                            <label htmlFor="terms-checkbox" className={`text-sm ${subtleDarkTextColor} select-none cursor-pointer`}>
                                Saya menyatakan bahwa data yang saya isikan adalah benar dan saya menyetujui{" "}
                                <a href="/terms" target="_blank" rel="noopener noreferrer" className={`font-semibold ${secondaryDarkTextColor} hover:${primaryDarkTextColor} hover:underline`}>
                                    Syarat & Ketentuan
                                </a>{" "}
                                serta{" "}
                                <a href="/privacy" target="_blank" rel="noopener noreferrer" className={`font-semibold ${secondaryDarkTextColor} hover:${primaryDarkTextColor} hover:underline`}>
                                    Kebijakan Privasi
                                </a>{" "}
                                HealthAuth.
                            </label>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || cooldown}
                        className={`w-full flex justify-center items-center py-3.5 px-6 text-base font-semibold rounded-xl text-white 
                                 bg-gradient-to-r from-[#1E47A0] to-[#123A7A] hover:from-[#123A7A] hover:to-[#1E47A0] 
                                 focus:outline-none focus:ring-4 focus:ring-[#A0D0D5]/70 focus:ring-offset-2 focus:ring-offset-white
                                 transition-all duration-300 ease-in-out transform hover:scale-[1.02] shadow-lg hover:shadow-xl
                                 ${loading || cooldown ? 'opacity-70 cursor-not-allowed' : 'opacity-100'}`}
                    >
                        {loading ? ( <> <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Memproses... </>
                        ) : "Daftar Akun Sekarang"}
                    </button>
                </form>

                <p className={`mt-10 text-center text-sm ${subtleDarkTextColor}`}>
                    Sudah memiliki akun HealthAuth?{" "}
                    <a href="/signin" className={`font-semibold ${secondaryDarkTextColor} hover:${primaryDarkTextColor} hover:underline`}>
                        Masuk di sini
                    </a>
                </p>
            </div>
        </div>
    );
}