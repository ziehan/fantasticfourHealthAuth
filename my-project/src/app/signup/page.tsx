"use client";

import { FormEvent, useState, useEffect } from "react";
import AddressDropdown from "@/components/AddressDropdown";
import { supabase } from "@/lib/supabase";

// --- Komponen Styling Umum (dari STYLING HACKATHON) ---
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
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);
  return ( <div className={`transition-all ease-out ${duration} ${delay} ${className} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>{children}</div> );
};

// Styling Konstanta
const darkBluePageGradient = "bg-gradient-to-br from-[#1A0A3B] via-[#1E47A0] to-[#123A7A]";
const whiteBoxClass = "bg-white/90 backdrop-blur-xl shadow-2xl rounded-2xl p-8 md:p-10 border border-white/20";
const primaryDarkTextColor = "text-[#1A0A3B]";
const secondaryDarkTextColor = "text-[#1E47A0]";
const subtleDarkTextColor = "text-gray-600";
const lightInputBaseClass = `w-full bg-gray-50 border border-gray-300 ${primaryDarkTextColor} placeholder-gray-400 rounded-xl p-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1E47A0] focus:border-[#1E47A0] transition-colors text-sm shadow-sm`;
const adminPrimaryButtonClass = `w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-semibold rounded-full text-white bg-gradient-to-r from-[#1E47A0] to-[#123A7A] hover:from-[#123A7A] hover:to-[#1E47A0] focus:outline-none focus:ring-4 focus:ring-[#A0D0D5]/70 focus:ring-offset-2 focus:ring-offset-white transition-all duration-150 ease-in-out transform hover:scale-105`;
// --- Akhir Komponen Styling Umum ---

export default function SignupPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [cooldown, setCooldown] = useState(false);
    const [cooldownLeft, setCooldownLeft] = useState(50);
    const [formData, setFormData] = useState({
        fullname: "",
        nik: "",
        email: "",
        phone: "",
        birthDay: "",
        birthMonth: "",
        birthYear: "",
        birthPlace: "",
        password: "",
        confirmPassword: "",
        address: "",
        profession: "",
        province: "",
        regency: "",
        district: "",
        village: "",
    });

    const [error, setError] = useState("");

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setError(""); // Hapus pesan error saat input berubah
    };

    const isValidPhone = (phone: string) => {
        const regex = /^(\+62|0)8[0-9]{6,}$/;
        if (!regex.test(phone)) return false;
        if (/[^0-9+]/.test(phone)) return false;
        return true;
    };

    const isValidNik = (nik: string) => {
        const nikRegex = /^[0-9]{16}$/;
        return nikRegex.test(nik);
    };

    const fieldLabels: Record<string, string> = {
        fullname: "Nama Lengkap",
        nik: "NIK",
        email: "Email",
        phone: "Nomor Telepon",
        password: "Kata Sandi",
        birthPlace: "Tempat Lahir",
        birthDay: "Tanggal Lahir",
        birthMonth: "Bulan Lahir",
        birthYear: "Tahun Lahir",
        confirmPassword: "Konfirmasi Kata Sandi",
        address: "Alamat",
        profession: "Profesi",
        province: "Provinsi",
        regency: "Kabupaten/Kota",
        district: "Kecamatan",
        village: "Desa/Kelurahan"
    };

    function validatePassword(password: string): boolean {
        if (password.length < 6) return false;

        const hasLower = /[a-z]/.test(password);
        const hasUpper = /[A-Z]/.test(password);
        const hasNumber = /\d/.test(password);

        return hasLower && hasUpper && hasNumber;
    }

    type AddressDropdownProps = {
        onChange: (selection: {
            provinceId: number | null;
            regencyId: number | null;
            districtId: number | null;
            villageId: number | null;
        }) => void;

    };


    // useEffect untuk cooldown tetap sama
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (cooldown) {
            timer = setInterval(() => {
                setCooldownLeft((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        setCooldown(false);
                        return 50;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [cooldown]);

    async function getLocationName(table: string, id: number | null) {
        if (!id) return "";
        const { data, error } = await supabase
            .from(table)
            .select("name")
            .eq("id", id)
            .single();
        if (error) {
            console.error(`Gagal mengambil ${table}:`, error.message);
            return "";
        }
        return data?.name || "";
    }


    async function handleSignup(event: React.FormEvent) {
        event.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);

        // Periksa apakah ada field yang kosong
        const emptyFields = Object.entries(formData).filter(([key, value]) => value === "");
        if (emptyFields.length > 0) {
            setError(`Mohon isi kolom: ${emptyFields
                .map(([key]) => fieldLabels[key] || key)
                .join(", ")}`
            );
            return;
        }
        if (!isValidNik(formData.nik)) {
            setError("NIK tidak valid. Harus terdiri dari 16 digit angka tanpa huruf.");
            return;
        }
        if (!isValidPhone(formData.phone)) {
            setError("Nomor telepon tidak valid. Hanya angka yang diperbolehkan.");
            return;
        }
        if (!validatePassword(formData.password)) {
            setError('Password harus minimal 6 karakter, dan mengandung huruf kecil, huruf kapital, serta angka.');
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            setError("Kata sandi dan Konfirmasi Kata sandi tidak cocok.");
            return;
        }

        try {
            // 2. Proses signup ke Supabase Auth
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password
            });

            // 3. Handle error signup
            if (authError) {
                if (authError.message.includes('For security purposes')) {
                    setCooldown(true);
                    setError('Tunggu 50 detik sebelum mencoba lagi.');
                } else {
                    setError(authError.message);
                }
                setLoading(false);
                return;
            }

            // 4. Ambil user data
            const user = authData.user;
            if (!user) {
                setError('Gagal mendapatkan data user.');
                setLoading(false);
                return;
            }

            // 5. Cek apakah email sudah terdaftar di profiles
            const { data: existingProfile, error: checkProfileError } = await supabase
                .from('profiles')
                .select('email')
                .eq('email', formData.email)
                .maybeSingle();

            if (checkProfileError) {
                setError(`Gagal memeriksa profil: ${checkProfileError.message}`);
                setLoading(false);
                return;
            }

            if (existingProfile) {
                setError('Email sudah terdaftar sebelumnya.');
                setLoading(false);
                return;
            }
            const { data: existingUser, error } = await supabase
                .from("profiles")
                .select("nik")
                .eq("nik", formData.nik)
                .single();

            if (existingUser) {
                setError("NIK anda sudah terdaftar.");
                setLoading(false);
                return;
            }

            if (error && error.code !== "PGRST116") {
                console.error("Error saat cek NIK:", error.message);
                setError("Terjadi kesalahan saat memeriksa NIK. Coba lagi.");
                setLoading(false);
                return;
            }

            // 6. Persiapan data untuk insert
            const profileData = {
                user_id: user.id,
                email: formData.email,
                fullname: formData.fullname,
                nik: formData.nik,
                phone: formData.phone,
                birth_day: parseInt(formData.birthDay),
                birth_month: parseInt(formData.birthMonth),
                birth_year: parseInt(formData.birthYear),
                birth_place: formData.birthPlace,
                address: formData.address,
                province_id: formData.province,
                regency_id: formData.regency,
                district_id: formData.district,
                village_id: formData.village,
                profession: formData.profession,
                is_pending_verification: true,
            };

            // 7. Insert data ke profiles
            const { error: profileError } = await supabase
                .from('profiles')
                .insert(profileData);

            if (profileError) {
                console.error('Profile insert error:', profileError);
                setError(`Gagal menyimpan data: ${profileError.message}`);
                setLoading(false);
                return;
            }

            // 8. Sukses - Reset form dan tampilkan pesan
            setFormData({
                fullname: "",
                nik: "",
                email: "",
                phone: "",
                birthDay: "",
                birthMonth: "",
                birthYear: "",
                birthPlace: "",
                password: "",
                confirmPassword: "",
                address: "",
                profession: "",
                province: "",
                regency: "",
                district: "",
                village: ""
            });

            setMessage('Registrasi berhasil! Silakan cek email untuk verifikasi akun.');
            setLoading(false);

        } catch (error: any) {
            console.error('Unexpected error:', error);
            setError('Terjadi kesalahan yang tidak terduga. Silakan coba lagi.');
            setLoading(false);
        }
    };

    return (
        <div className={`min-h-screen flex items-center justify-center overflow-y-auto px-4 py-12 sm:px-6 lg:px-8 ${darkBluePageGradient} selection:bg-[#A0D0D5] selection:text-[#1A0A3B]`}>
            <FloatingGeometricShapes shapeClassName="bg-[#A0D0D5]/10" count={20} />
            
            <FadeInUp className={`${whiteBoxClass} w-full max-w-3xl space-y-6`}>
                <div className="text-center">
                    <h1 className={`text-3xl font-bold ${primaryDarkTextColor}`}>Daftar</h1>
                    <p className={`mt-2 text-sm ${subtleDarkTextColor}`}>Buat akun HealthAuth Anda sendiri.</p>
                </div>

                <form className="space-y-5" onSubmit={handleSignup}>
                    <div>
                        <label className={`block text-sm font-medium mb-1.5 ${secondaryDarkTextColor}`}>Nama Lengkap</label>
                        <input
                            type="text"
                            name="fullname"
                            placeholder="Nama Lengkap"
                            value={formData.fullname}
                            onChange={handleInputChange}
                            className={lightInputBaseClass}
                        />
                    </div>
                    
                    <div>
                        <label className={`block text-sm font-medium mb-1.5 ${secondaryDarkTextColor}`}>NIK</label>
                        <input
                            type="text"
                            name="nik"
                            placeholder="NIK"
                            value={formData.nik}
                            onChange={handleInputChange}
                            className={lightInputBaseClass}
                        />
                    </div>
                    
                    <div>
                        <label className={`block text-sm font-medium mb-1.5 ${secondaryDarkTextColor}`}>Email</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className={lightInputBaseClass}
                        />
                    </div>
                    
                    <div>
                        <label className={`block text-sm font-medium mb-1.5 ${secondaryDarkTextColor}`}>Phone</label>
                        <input
                            type="tel"
                            name="phone"
                            placeholder="Nomor Telepon"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className={lightInputBaseClass}
                        />
                    </div>
                    
                    <div>
                        <label className={`block text-sm font-medium mb-1.5 ${secondaryDarkTextColor}`}>Tempat, Tanggal Lahir</label>
                        <div className="flex gap-4">
                            {/* Input Tempat Lahir di kiri */}
                            <input
                                type="text"
                                name="birthPlace"
                                placeholder="Tempat Lahir"
                                value={formData.birthPlace}
                                onChange={handleInputChange}
                                className={`${lightInputBaseClass} w-1/3`}
                            />

                            {/* Dropdown Tanggal, Bulan, Tahun di kanan */}
                            <div className="flex gap-3 w-2/3">
                                <select
                                    name="birthDay"
                                    value={formData.birthDay}
                                    onChange={handleInputChange}
                                    className={`${lightInputBaseClass} w-1/3`}
                                >
                                    <option value="" disabled>Tanggal</option>
                                    {[...Array(31)].map((_, i) => (
                                        <option key={i + 1} value={i + 1}>{i + 1}</option>
                                    ))}
                                </select>

                                <select
                                    name="birthMonth"
                                    value={formData.birthMonth}
                                    onChange={handleInputChange}
                                    className={`${lightInputBaseClass} w-1/3`}
                                >
                                    <option value="" disabled>Bulan</option>
                                    {[
                                        "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
                                        "Jul", "Agu", "Sep", "Okt", "Nov", "Des"
                                    ].map((m, idx) => (
                                        <option key={idx} value={idx + 1}>{m}</option>
                                    ))}
                                </select>

                                <select
                                    name="birthYear"
                                    value={formData.birthYear}
                                    onChange={handleInputChange}
                                    className={`${lightInputBaseClass} w-1/3`}
                                >
                                    <option value="" disabled>Tahun</option>
                                    {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i).map(year => (
                                        <option key={year} value={year}>{year}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className={`block text-sm font-medium mb-1.5 ${secondaryDarkTextColor}`}>Kata Sandi</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Kata Sandi"
                            value={formData.password}
                            onChange={handleInputChange}
                            className={lightInputBaseClass}
                        />
                    </div>
                    
                    <div>
                        <label className={`block text-sm font-medium mb-1.5 ${secondaryDarkTextColor}`}>Konfirmasi Kata Sandi</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Konfirmasi Kata Sandi"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            className={lightInputBaseClass}
                        />
                    </div>
                    
                    <div>
                        <label className={`block text-sm font-medium mb-1.5 ${secondaryDarkTextColor}`}>Alamat</label>
                        <input
                            type="text"
                            name="address"
                            placeholder="Alamat"
                            value={formData.address}
                            onChange={handleInputChange}
                            className={lightInputBaseClass}
                        />
                    </div>

                    {/* Tambahkan komponen dropdown alamat di sini */}
                    <div className="space-y-4">
                        <AddressDropdown
                            onChange={({ provinceName, regencyName, districtName, villageName }) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    province: provinceName,
                                    regency: regencyName,
                                    district: districtName,
                                    village: villageName,
                                }))
                            }
                        />
                    </div>
                    
                    <div>
                        <label className={`block text-sm font-medium mb-1.5 ${secondaryDarkTextColor}`}>Profesi</label>
                        <select
                            name="profession"
                            value={formData.profession}
                            onChange={handleInputChange}
                            className={lightInputBaseClass}
                        >
                            <option value="" disabled selected>Pilih Profesi</option>
<option value="dokter_umum">Dokter Umum</option>
<option value="dokter_spesialis">Dokter Spesialis</option>
<option value="dokter_gigi">Dokter Gigi</option>
<option value="dokter_hewan">Dokter Hewan</option>
<option value="dokter_bedah">Dokter Bedah</option>
<option value="dokter_anak">Dokter Anak</option>
<option value="dokter_kandungan">Dokter Kandungan</option>
<option value="dokter_jantung">Dokter Jantung</option>
<option value="dokter_saraf">Dokter Saraf</option>
<option value="dokter_psikiater">Psikiater</option>
<option value="tenaga_medis">Tenaga Medis</option>
<option value="tenaga_keperawatan">Tenaga Keperawatan</option>
<option value="bidan">Bidan</option>
<option value="apoteker">Apoteker</option>
<option value="analis_kesehatan">Analis Kesehatan</option>
<option value="radiografer">Radiografer</option>
<option value="ahli_gizi">Ahli Gizi</option>
<option value="terapis_gigi_dan_mulut">Terapis Gigi dan Mulut</option>
<option value="terapis_wicara">Terapis Wicara</option>
<option value="terapis_fisik">Terapis Fisik (Fisioterapis)</option>
<option value="rekam_medis">Tenaga Rekam Medis</option>
<option value="sanitarian">Sanitarian (Tenaga Kesehatan Lingkungan)</option>
<option value="psikolog">Psikolog Klinis</option>
<option value="konselor_adiksi">Konselor Adiksi</option>
<option value="tenaga_kesehatan_tradisional">Tenaga Kesehatan Tradisional</option>
<option value="tenaga_kesehatan_nasional">Tenaga Kesehatan Nasional</option>
                        </select>
                    </div>

                    {error && (
                        <div className="bg-red-50 p-3 rounded-md border border-red-200">
                            <p className="text-red-600 text-sm text-center">{error}</p>
                        </div>
                    )}

                    <div className="flex items-start gap-2 text-sm">
                        <input
                            id="terms-checkbox"
                            type="checkbox"
                            className="mt-1 h-4 w-4 text-[#1E47A0] border-gray-300 rounded focus:ring-[#1E47A0]/50"
                            required
                        />
                        <label htmlFor="terms-checkbox" className={`select-none ${subtleDarkTextColor}`}>
                            Saya telah membaca, memahami, dan menyetujui Syarat & Ketentuan serta
                            Kebijakan Privasi yang berlaku.
                        </label>
                    </div>
                    
                    {message && (
                        <div className="bg-green-50 p-3 rounded-md border border-green-200">
                            <p className="text-green-600 text-sm text-center">{message}</p>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className={`${adminPrimaryButtonClass} ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
                    >
                        {loading ? 'Mendaftar...' : 'Daftar'}
                    </button>
                </form>

                <p className={`mt-8 text-center text-sm ${subtleDarkTextColor}`}>
                    Sudah punya akun?{" "}
                    <a href="/login" className={`font-medium ${secondaryDarkTextColor} hover:${primaryDarkTextColor} hover:underline`}>
                        Masuk
                    </a>
                </p>
            </FadeInUp>
        </div>
    );
}