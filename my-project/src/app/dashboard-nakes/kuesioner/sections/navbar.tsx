// components/Navbar.tsx
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheckIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { Transition } from '@headlessui/react'; // Untuk animasi mobile menu yang lebih halus
// Removed unused or incorrect imports:
// import { a, b, nav } from 'framer-motion/client'; // Remove if not used
// import { link } from 'fs'; // Incorrect for client-side
// import { text } from 'stream/consumers'; // Incorrect for client-side

// Warna yang akan kita gunakan
const bluePrimary = '#1E47A0';   // Biru medium untuk teks utama & ikon
const blueHover = '#3764C3';     // Biru untuk hover link
const darkText = '#1A0A3B';      // Teks paling gelap untuk logo
const paleCyan = '#E0F2F3';      // Latar tombol logout
const lightCyan = '#A0D0D5';     // Latar hover tombol logout & aksen
const separatorColor = '#A0D0D5'; // Warna separator mobile menu

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const NavLink: React.FC<NavLinkProps> = ({ href, children, className, onClick }) => {
  return (
    <a
      href={href}
      onClick={onClick}
      // Updated to use defined color variables and correct template literal syntax
      className={`text-[${bluePrimary}] hover:text-[${blueHover}] px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 whitespace-nowrap hover:bg-white/20 ${className || ''}`}
    >
      {children}
    </a>
  );
};


const HealthAuthLogo: React.FC = () => (
  <a href="./" className="flex items-center group">
    {/* Corrected className to use template literals for JS variables */}
    <ShieldCheckIcon className={`h-8 w-8 text-[${bluePrimary}] group-hover:text-[${blueHover}] transition-colors duration-300`} />
    <span className={`ml-2.5 text-xl font-bold text-[${darkText}] group-hover:text-[${bluePrimary}] transition-colors duration-300`}>
      HealthAuth
    </span>
  </a>
);

const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navbarRef = useRef<HTMLElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    alert('Logout clicked!');
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { href: "../dashboard-nakes/#Jadwal", label: "Jadwal" },
    { href: "../dashboard-nakes/#Profil", label: "Profil" },
    { href: "../dashboard-nakes/#Pelatihan", label: "Pelatihan" },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        mobileMenuOpen &&
        navbarRef.current && !navbarRef.current.contains(event.target as Node) &&
        mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mobileMenuOpen]);

  return (
    <nav
      ref={navbarRef}
      className={`fixed top-4 left-1/2 -translate-x-1/2
                   bg-white/70 backdrop-blur-xl shadow-2xl rounded-full
                   flex items-center justify-between
                   py-3 sm:py-3.5 px-4 sm:px-6 md:px-8
                   w-[calc(100%-2rem)] max-w-6xl z-50 transition-all duration-300 ease-in-out`}
    >
      <HealthAuthLogo />

      {/* Desktop Nav Links */}
      <div className="hidden lg:flex items-center space-x-1 xl:space-x-2">
        {navLinks.map((link) => (
          <NavLink key={link.label} href={link.href}>
            {link.label}
          </NavLink>
        ))}
      </div>

      {/* Logout Button for Desktop */}
      <div className="hidden lg:block">
        <button
          onClick={handleLogout}
          // Corrected className to use template literals
          className={`bg-[${paleCyan}] text-[${bluePrimary}] hover:bg-[${lightCyan}]
                      font-semibold py-2 px-6 rounded-full text-sm transition-all duration-300 ease-in-out
                      focus:outline-none focus:ring-2 focus:ring-[${bluePrimary}] focus:ring-opacity-50 transform hover:scale-105`}
        >
          Logout
        </button>
      </div>

      {/* Mobile Menu Button */}
      <div className="lg:hidden">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          // Corrected className to use template literals
          className={`text-[${bluePrimary}] hover:text-[${blueHover}] focus:outline-none p-2 rounded-full hover:bg-white/30 transition-colors`}
          aria-label="Open menu"
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? (
            <XMarkIcon className="h-7 w-7" />
          ) : (
            <Bars3Icon className="h-7 w-7" />
          )}
        </button>
      </div>

      {/* Mobile Menu Dropdown with Transition */}
      <Transition
        show={mobileMenuOpen}
        as={React.Fragment}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"
      >
        <div
          ref={mobileMenuRef}
          className={`lg:hidden absolute top-[calc(100%+0.75rem)] left-0 right-0
                      bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl
                      mx-auto w-[calc(100%-1rem)] max-w-md
                      py-4 z-40 border border-gray-200/50`}
        >
          <div className="flex flex-col space-y-1 px-4">
            {navLinks.map((link) => (
              <NavLink
                key={link.label}
                href={link.href}
                // Corrected className to use template literals
                className={`block text-center py-2.5 !whitespace-normal border-b border-[${separatorColor}]/30 last:border-b-0`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}
            <div className="pt-3">
              <button
                onClick={handleLogout}
                // Corrected className to use template literals
                className={`w-full bg-[${paleCyan}] text-[${bluePrimary}] hover:bg-[${lightCyan}]
                              font-semibold py-2.5 px-6 rounded-full text-sm transition-all
                              duration-300 ease-in-out focus:outline-none focus:ring-2
                              focus:ring-[${bluePrimary}] focus:ring-opacity-50`}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </nav>
  );
};

export default Navbar;