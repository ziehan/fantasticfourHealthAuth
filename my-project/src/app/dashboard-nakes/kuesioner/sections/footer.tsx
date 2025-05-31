// components/footer.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { ArrowUpIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

// --- Palet Warna & Konfigurasi (konsisten dengan tema utama) ---
const footerTheme = {
  colors: {
    // === PERUBAHAN DI SINI ===
    background: '#1A0A3B',        // Latar belakang biru sangat gelap (primaryDark dari tema)
    // ==========================
    textPrimary: '#E0F2F3',       // Teks utama (putih kebiruan) - sudah cocok
    textSecondary: '#A0D0D5',     // Teks sekunder, link, aksen - sudah cocok
    textHover: '#FFFFFF',         // Warna hover untuk link - sudah cocok
    border: '#303952',          // Warna border/pemisah (biru gelap keabu-abuan) - sudah cocok
    buttonAccentFrom: '#A0D0D5',  // Gradien tombol BackToTop - aksen cyan
    buttonAccentTo: '#c3e4e7',    // Gradien tombol BackToTop - aksen cyan lebih terang
    buttonTextDark: '#1A0A3B',    // Teks untuk tombol BackToTop
  },
  fontSizes: {
    base: 'text-sm',
    small: 'text-xs',
    heading: 'text-md font-semibold',
  }
};

// --- Data untuk Link Footer (tetap sama) ---
const footerLinks = {
  perusahaan: [
    { label: 'Tentang Kami', href: '#about' }, // Ganti ke hash link jika ini single page app
    { label: 'Karier', href: '/careers' }, // Biarkan jika ini halaman terpisah
    { label: 'Blog HealthAuth', href: '/blog' },
    { label: 'Hubungi Kami', href: '#footer' }, // Mengarah ke footer itu sendiri atau section kontak
  ],
  solusi: [
    { label: 'Analisis Burnout', href: '/features/burnout-analysis' },
    { label: 'Survei Kustom', href: '/features/custom-surveys' },
    { label: 'Diagnosis Cerdas (AI)', href: '/features/ai-diagnosis' },
    { label: 'Kesiapsiagaan Krisis', href: '/features/crisis-preparedness' },
  ],
  sumberDaya: [
    { label: 'Pusat Bantuan (FAQ)', href: '#faq' }, // Ganti ke hash link jika ini single page app
    { label: 'Dokumentasi API', href: '/docs/api' },
    { label: 'Studi Kasus', href: '/case-studies' },
    { label: 'Webinar & Acara', href: '/events' },
  ],
  legal: [
    { label: 'Kebijakan Privasi', href: '/privacy-policy' },
    { label: 'Syarat & Ketentuan', href: '/terms-of-service' },
    { label: 'Pengaturan Cookie', href: '/cookie-settings' },
  ],
};

const socialMediaLinks = [
  { name: 'Facebook', href: '#' },
  { name: 'Twitter', href: '#' },
  { name: 'LinkedIn', href: '#' },
  { name: "Instagram", href: "#" }
];

// --- Props untuk Footer (jika ingin ID untuk navigasi) ---
interface FooterProps {
  id?: string;
}

// --- Komponen Footer Utama ---
const Footer: React.FC<FooterProps> = ({ id }) => {
  const [showBackToTop, setShowBackToTop] = useState(false);

  const handleScroll = () => {
    if (window.scrollY > 300) {
      setShowBackToTop(true);
    } else {
      setShowBackToTop(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const currentYear = new Date().getFullYear();

  return (
    <footer id={id} className={`bg-[${footerTheme.colors.background}] text-[${footerTheme.colors.textPrimary}] pt-16 pb-8 relative`}>
      <div className="container mx-auto max-w-screen-xl px-6 lg:px-8">
        {/* Bagian Atas Footer: Logo, Deskripsi, Link Kolom */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-10 md:gap-8 mb-12">
          {/* Kolom 1: Logo & Deskripsi */}
          <div className="md:col-span-3 lg:col-span-2">
            {/* Ganti href logo ke #hero atau # jika untuk scroll ke atas di SPA */}
            <a href="#hero" className="flex items-center mb-4 group">
              <ShieldCheckIcon className={`h-9 w-9 text-[${footerTheme.colors.textSecondary}] group-hover:text-[${footerTheme.colors.textHover}] transition-colors`} />
              <span className={`ml-2.5 text-2xl font-bold text-[${footerTheme.colors.textPrimary}] group-hover:text-[${footerTheme.colors.textHover}] transition-colors`}>
                HealthAuth
              </span>
            </a>
            <p className={`${footerTheme.fontSizes.base} text-[${footerTheme.colors.textSecondary}]/80 leading-relaxed max-w-md`}>
              Merevolusi kesejahteraan dan efektivitas profesional medis melalui solusi teknologi terpadu dan inovatif.
            </p>
            <div className="mt-6 flex space-x-4">
              {socialMediaLinks.map(social => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${footerTheme.fontSizes.small} text-[${footerTheme.colors.textSecondary}] hover:text-[${footerTheme.colors.textHover}] transition-colors font-medium`}
                  aria-label={social.name}
                >
                  {social.name} {/* Ganti dengan Ikon SVG jika ada */}
                </a>
              ))}
            </div>
          </div>

          {/* Kolom Link Perusahaan */}
          <div>
            <h3 className={`${footerTheme.fontSizes.heading} text-[${footerTheme.colors.textPrimary}] mb-4`}>Perusahaan</h3>
            <ul className="space-y-2.5">
              {footerLinks.perusahaan.map(link => (
                <li key={link.label}>
                  <a href={link.href} className={`${footerTheme.fontSizes.base} text-[${footerTheme.colors.textSecondary}] hover:text-[${footerTheme.colors.textHover}] transition-colors`}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Kolom Link Solusi Kami */}
          <div>
            <h3 className={`${footerTheme.fontSizes.heading} text-[${footerTheme.colors.textPrimary}] mb-4`}>Solusi Kami</h3>
            <ul className="space-y-2.5">
              {footerLinks.solusi.map(link => (
                <li key={link.label}>
                  <a href={link.href} className={`${footerTheme.fontSizes.base} text-[${footerTheme.colors.textSecondary}] hover:text-[${footerTheme.colors.textHover}] transition-colors`}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Kolom Link Sumber Daya */}
          <div>
            <h3 className={`${footerTheme.fontSizes.heading} text-[${footerTheme.colors.textPrimary}] mb-4`}>Sumber Daya</h3>
            <ul className="space-y-2.5">
              {footerLinks.sumberDaya.map(link => (
                <li key={link.label}>
                  <a href={link.href} className={`${footerTheme.fontSizes.base} text-[${footerTheme.colors.textSecondary}] hover:text-[${footerTheme.colors.textHover}] transition-colors`}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Garis Pemisah */}
        <div className={`border-t border-[${footerTheme.colors.border}] pt-8`}>
          {/* Bagian Bawah Footer: Copyright & Legal Links */}
          <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
            <p className={`${footerTheme.fontSizes.small} text-[${footerTheme.colors.textSecondary}]/70`}>
              &copy; {currentYear} HealthAuth. Semua Hak Dilindungi. Dirancang dengan ❤️ di Indonesia.
            </p>
            <ul className="flex flex-wrap justify-center md:justify-start space-x-4 mt-4 md:mt-0">
              {footerLinks.legal.map(link => (
                <li key={link.label}>
                  <a href={link.href} className={`${footerTheme.fontSizes.small} text-[${footerTheme.colors.textSecondary}]/80 hover:text-[${footerTheme.colors.textHover}] transition-colors`}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Tombol Kembali ke Atas */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className={`fixed bottom-6 right-6 bg-gradient-to-br from-[${footerTheme.colors.buttonAccentFrom}] to-[${footerTheme.colors.buttonAccentTo}] text-[${footerTheme.colors.buttonTextDark}] 
                      p-3 rounded-full shadow-2xl hover:shadow-[${footerTheme.colors.buttonAccentFrom}]/50
                      transition-all duration-300 ease-in-out transform hover:scale-110 focus:outline-none 
                      focus:ring-2 focus:ring-offset-2 focus:ring-offset-[${footerTheme.colors.background}] focus:ring-[${footerTheme.colors.buttonAccentFrom}]`}
          aria-label="Kembali ke atas"
        >
          <ArrowUpIcon className="w-6 h-6" />
        </button>
      )}
    </footer>
  );
};

export default Footer;