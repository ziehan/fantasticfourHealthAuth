'use client';

import { useState, useEffect, FormEvent } from 'react'; // Tambahkan useEffect untuk FadeInUp
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { EyeIcon, EyeSlashIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline'; // Tambahkan ikon jika perlu

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
    const timer = setTimeout(() => setIsVisible(true), 50); // Sedikit delay untuk memicu animasi
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
const googleButtonClass = `w-full flex justify-center items-center gap-2.5 py-2.5 px-4 rounded-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition font-semibold shadow-sm`;
// --- Akhir Komponen Styling Umum ---


const LoginPage = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false); // State untuk toggle password

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(''); // Clear previous errors
        const { error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) {
            setError(error.message);
        } else {
            router.push('/dashboard-nakes'); // Arahkan ke dashboard setelah login (sesuaikan jika perlu)
        }
    };

    const handleGoogleLogin = async () => {
        setError(''); // Clear previous errors
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${location.origin}/auth/callback`, // Pastikan path callback benar
            },
        });

        if (error) {
            setError(error.message);
        }
    };

    return (
        <div className={`min-h-screen flex items-center justify-center overflow-y-auto px-4 py-12 sm:px-6 lg:px-8 ${darkBluePageGradient} selection:bg-[#A0D0D5] selection:text-[#1A0A3B]`}>
            <FloatingGeometricShapes shapeClassName="bg-[#A0D0D5]/10" count={20} />
            
            <FadeInUp className={`${whiteBoxClass} w-full max-w-md space-y-8`}> {/* max-w-md untuk form login */}
                <div className="text-center">
                    {/* Logo bisa ditambahkan di sini jika perlu */}
                    {/* <img className="mx-auto h-12 w-auto" src="/logo-healthauth.png" alt="HealthAuth" /> */}
                    <h1 className={`text-3xl font-bold ${primaryDarkTextColor}`}>
                        Selamat Datang Kembali
                    </h1>
                    <p className={`mt-2 text-sm ${subtleDarkTextColor}`}>
                        Masuk ke akun HealthAuth Anda.
                    </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label htmlFor="email" className={`block text-sm font-medium mb-1.5 ${secondaryDarkTextColor}`}>Alamat Email</label>
                        <input
                            id="email"
                            type="email"
                            placeholder="nama@domain.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className={lightInputBaseClass}
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className={`block text-sm font-medium mb-1.5 ${secondaryDarkTextColor}`}>Kata Sandi</label>
                        <div className="relative">
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Masukkan kata sandi Anda"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className={`${lightInputBaseClass} pr-10`} // Tambah padding kanan untuk ikon mata
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                                title={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                            >
                                {showPassword ? (
                                    <EyeSlashIcon className={`h-5 w-5 ${subtleDarkTextColor}`} />
                                ) : (
                                    <EyeIcon className={`h-5 w-5 ${subtleDarkTextColor}`} />
                                )}
                            </button>
                        </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input id="remember-me" name="remember-me" type="checkbox" className={`h-4 w-4 text-[#1E47A0] focus:ring-[#1E47A0]/50 border-gray-300 rounded`} />
                            <label htmlFor="remember-me" className={`ml-2 block text-sm ${subtleDarkTextColor}`}> Ingat saya </label>
                        </div>
                        <div className="text-sm">
                            <a href="#" className={`font-medium ${secondaryDarkTextColor} hover:${primaryDarkTextColor} hover:underline`}> Lupa kata sandi? </a>
                        </div>
                    </div>


                    {error && (
                        <div className="bg-red-50 p-3 rounded-md border border-red-200">
                            <p className="text-red-600 text-sm text-center">{error}</p>
                        </div>
                    )}

                    <button
                        type="submit"
                        className={`${adminPrimaryButtonClass} group`} // group untuk ikon jika ada
                    >
                        <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2 opacity-80 group-hover:opacity-100 transition-opacity" />
                        Masuk ke Akun
                    </button>
                </form>

                <div className="relative my-6"> {/* my-6 untuk spasi */}
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                        <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className={`px-2 bg-white/90 ${subtleDarkTextColor}`}>Atau masuk dengan</span> {/* bg disesuaikan dengan whiteBoxClass */}
                    </div>
                </div>

                <div>
                    <button
                        onClick={handleGoogleLogin}
                        className={googleButtonClass}
                    >
                        <svg className="w-5 h-5" aria-hidden="true" viewBox="0 0 24 24"> {/* viewBox disesuaikan */}
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                            <path d="M1 1h22v22H1z" fill="none"/>
                        </svg>
                        Masuk dengan Google
                    </button>
                </div>

                <p className={`mt-10 text-center text-sm ${subtleDarkTextColor}`}>
                    Belum punya akun?{" "}
                    <a href="/signup" className={`font-medium ${secondaryDarkTextColor} hover:${primaryDarkTextColor} hover:underline`}>
                        Daftar sekarang
                    </a>
                </p>
            </FadeInUp>
        </div>
    );
};

export default LoginPage;