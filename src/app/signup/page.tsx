"use client";

import { FormEvent, useState, useEffect } from "react";
import AddressDropdown from "@/components/AddressDropdown";
import { supabase } from "@/lib/supabase";

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
                province_id: formData.province,  // sudah string nama provinsi
                regency_id: formData.regency,
                district_id: formData.district,
                village_id: formData.village,
                profession: formData.profession
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
        <div
            className="min-h-screen bg-cover bg-center flex items-center justify-center overflow-y-auto px-4 py-12 sm:px-6 lg:px-8"
            style={{ backgroundImage: "url('/bg.png')" }}
        >
            <div className="bg-white/80 backdrop-blur-md shadow-xl rounded-2xl p-8 w-full max-w-xl space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-center text-gray-900">Daftar</h1>
                    <p className="mt-2 text-center text-sm text-gray-600">Buat akun Anda sendiri.</p>
                </div>

                <form className="space-y-5" onSubmit={handleSignup}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                    <input
                        type="text"
                        name="fullname"
                        placeholder="Nama Lengkap"
                        value={formData.fullname}
                        onChange={handleInputChange}
                        className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    <label className="block text-sm font-medium text-gray-700 mb-1">NIK</label>
                    <input
                        type="text"
                        name="nik"
                        placeholder="NIK"
                        value={formData.nik}
                        onChange={handleInputChange}
                        className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                        type="tel"
                        name="phone"
                        placeholder="Nomor Telepon"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tempat, Tanggal Lahir</label>
                    <div className="flex gap-4">
                        {/* Input Tempat Lahir di kiri */}
                        <input
                            type="text"
                            name="birthPlace"
                            placeholder="Tempat Lahir"
                            value={formData.birthPlace}
                            onChange={handleInputChange}
                            className="appearance-none rounded-lg relative block w-1/3 px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />

                        {/* Dropdown Tanggal, Bulan, Tahun di kanan */}
                        <div className="flex gap-3 w-2/3">
                            <select
                                name="birthDay"
                                value={formData.birthDay}
                                onChange={handleInputChange}
                                className="appearance-none rounded-lg relative block w-1/3 px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
                                className="appearance-none rounded-lg relative block w-1/3 px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
                                className="appearance-none rounded-lg relative block w-1/3 px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            >
                                <option value="" disabled>Tahun</option>
                                {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i).map(year => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                        </div>
                    </div>



                    <label className="block text-sm font-medium text-gray-700 mb-1">Kata Sandi</label>
                    <input
                        type="password"
                        name="password"
                        placeholder="Kata Sandi"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    <label className="block text-sm font-medium text-gray-700 mb-1">Konfirmasi Kata Sandi</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Konfirmasi Kata Sandi"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    <label className="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
                    <input
                        type="text"
                        name="address"
                        placeholder="Alamat"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />

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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Profesi</label>
                    <select
                        name="profession"
                        value={formData.profession}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                        <option value="" disabled>Pilih Profesi</option>
                        <option value="tenaga_medis">Tenaga Medis</option>
                        <option value="tenaga_keperawatan">Tenaga Keperawatan</option>
                        <option value="tenaga_kebidanan">Tenaga Kebidanan</option>
                        <option value="tenaga_kefarmasian">Tenaga Kefarmasian</option>
                        <option value="tenaga_kesehatan_masyarakat">Tenaga Kesehatan Masyarakat</option>
                        <option value="tenaga_gizi">Tenaga Gizi</option>
                        <option value="tenaga_keterapian_fisik">Tenaga Keterapian Fisik</option>
                        <option value="tenaga_teknik_biomedika">Tenaga Teknik Biomedika</option>
                        <option value="tenaga_kesehatan_nasional">Tenaga Kesehatan Nasional</option>
                    </select>

                    {error && (
                        <div className="text-red-600 text-sm">
                            {error}
                        </div>
                    )}

                    <div className="flex items-start gap-2 text-sm text-gray-700">
                        <input
                            id="terms-checkbox"
                            type="checkbox"
                            className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            required
                        />
                        <label htmlFor="terms-checkbox" className="select-none">
                            Saya telah membaca, memahami, dan menyetujui Syarat & Ketentuan serta
                            Kebijakan Privasi yang berlaku.
                        </label>
                    </div>

                    <button
                        type="submit"
                        className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-full text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
                    >
                        Daftar
                    </button>
                </form>

                <p className="mt-8 text-center text-sm text-gray-600">
                    Sudah punya akun?{" "}
                    <a href="/signin" className="font-medium text-blue-600 hover:text-blue-500 hover:underline">
                        Masuk
                    </a>
                </p>
            </div>
        </div>
    );
}
