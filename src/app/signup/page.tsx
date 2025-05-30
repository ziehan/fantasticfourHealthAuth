'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('pasien');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(false);
  const [cooldownLeft, setCooldownLeft] = useState(50);

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

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    const { data: authData, error: authError } = await supabase.auth.signUp({ email, password });

    
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

    const user = authData.user;
    if (!user) {
      setError('Gagal mendapatkan data user.');
      setLoading(false);
      return;
    }

    const { data: existingProfile, error: checkProfileError } = await supabase
      .from('profiles')
      .select('verified, verification_level')
      .eq('user_id', user.id)
      .maybeSingle();

    if (checkProfileError) {
      setError(`Gagal memeriksa profil: ${checkProfileError.message}`);
      setLoading(false);
      return;
    }

    if (existingProfile) {
      if (!existingProfile.verified) {
        setError(`Email sudah terdaftar dan menunggu verifikasi oleh pihak ${existingProfile.verification_level}`);
      } else {
        setError('Email sudah terdaftar dan telah diverifikasi.');
      }
      setLoading(false);
      return;
    }


    const isVerified = status === 'pasien';
    const verificationLevel =
      status === 'pasien' ? 'none' : status === 'tenaga_kesehatan' ? 'rumah_sakit' : 'pemerintah';

    const { error: profileError } = await supabase.from('profiles').insert({
      user_id: user.id,
      email,
      status,
      verified: isVerified,
      verification_level: verificationLevel,
      verification_request_date: new Date().toISOString(),
    });

    if (profileError) {
      setError(`Gagal memeriksa profil: ${profileError.message}`);
      setLoading(false);
      return;
    }

    setMessage('Registrasi berhasil! Silakan cek email untuk verifikasi.');
    setLoading(false);
  }


  
  const handleGoogleSignup = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
    if (error) setError('Gagal login via Google');
  };

  const handlePhoneSignup = async () => {
    const phone = prompt('Masukkan nomor telepon dengan kode negara (cth: +6281234567890)');
    if (!phone) return;

    const { error } = await supabase.auth.signInWithOtp({ phone });
    if (error) setError('Gagal mengirim OTP ke nomor telepon.');
  };

  const handleWhatsAppSignup = async () => {
    const phone = prompt('Masukkan nomor WhatsApp (cth: +6281234567890)');
    if (!phone) return;

    // Kirim ke backend API kamu yg integrasi WhatsApp (Wablas, Twilio, dll)
    const response = await fetch('/api/send-whatsapp-otp', {
      method: 'POST',
      body: JSON.stringify({ phone }),
    });

    const result = await response.json();
    if (!result.success) {
      setError('Gagal mengirim OTP WhatsApp');
    } else {
      setMessage('Kode OTP dikirim via WhatsApp. Masukkan kode di layar berikutnya.');
      // Kamu bisa redirect ke halaman verifikasi OTP manual
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 space-y-4 bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 text-center">Daftar Akun</h2>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      {message && <p className="text-green-600 text-sm">{message}</p>}

      {/* FORM EMAIL + PASSWORD */}
      <form onSubmit={handleSignup} className="space-y-4">
        <input
          type="email"
          required
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded text-gray-800"
        />
        <input
          type="password"
          required
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded text-gray-800"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full p-2 border rounded text-gray-800"  
        >
          <option value="pasien">Pasien</option>
          <option value="tenaga_kesehatan">Tenaga Kesehatan</option>
          <option value="admin_rumah_sakit">Admin Rumah Sakit</option>
        </select>

        <button
          type="submit"
          disabled={loading || cooldown}
          className={`w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition ${
            cooldown ? 'opacity-50 cursor-not-allowed' : ''
          }`}    
        >
          {cooldown ? `Tunggu ${cooldownLeft}s` : loading ? 'Memproses...' : 'Daftar'}
        </button>
      </form>

      {/* ALTERNATIF SIGNUP */}
      <div className="border-t pt-4 space-y-3">
        <button
          onClick={handlePhoneSignup}
          className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition"  
        >
          Daftar dengan Nomor Telepon
        </button>
        <button
          onClick={handleGoogleSignup}
          className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition"  
        >
          Daftar dengan Google
        </button>
        <button
          onClick={handleWhatsAppSignup}
          className="w-full bg-emerald-600 text-white py-2 px-4 rounded hover:bg-emerald-700 transition"    
        >
          Daftar via WhatsApp
        </button>
      </div>
    </div>    
  );

}
