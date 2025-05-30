"use client";

import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, Zap, Shield, Users, ArrowRight } from 'lucide-react';

const ModernNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/80 backdrop-blur-lg border-b border-gray-200/20 shadow-lg' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex items-center space-x-2 group cursor-pointer">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                HealthHack
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            <a href="about" className="group relative px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors duration-300">
              <span className="relative z-10">Tentang</span>
              <div className="absolute inset-0 bg-blue-50 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300 origin-center"></div>
            </a>
            
            {/* Features Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="group relative flex items-center space-x-1 px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors duration-300"
              >
                <span className="relative z-10">Fitur</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                <div className="absolute inset-0 bg-blue-50 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300 origin-center"></div>
              </button>
              
              {/* Dropdown Menu */}
              <div className={`absolute top-full left-0 mt-2 w-64 bg-white/95 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200/20 transition-all duration-300 ${
                isDropdownOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
              }`}>
                <div className="p-2">
                  <a href="#ai-diagnosis" className="flex items-center space-x-3 p-3 rounded-xl hover:bg-blue-50 transition-colors duration-200 group">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                      <Zap className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 group-hover:text-blue-600">AI Diagnosis</div>
                      <div className="text-sm text-gray-500">Deteksi dini penyakit</div>
                    </div>
                  </a>
                  <a href="#telemedicine" className="flex items-center space-x-3 p-3 rounded-xl hover:bg-blue-50 transition-colors duration-200 group">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 group-hover:text-blue-600">Telemedicine</div>
                      <div className="text-sm text-gray-500">Konsultasi online</div>
                    </div>
                  </a>
                  <a href="#community" className="flex items-center space-x-3 p-3 rounded-xl hover:bg-blue-50 transition-colors duration-200 group">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 group-hover:text-blue-600">Komunitas</div>
                      <div className="text-sm text-gray-500">Forum diskusi sehat</div>
                    </div>
                  </a>
                </div>
              </div>
            </div>

            <a href="#pricing" className="group relative px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors duration-300">
              <span className="relative z-10">Harga</span>
              <div className="absolute inset-0 bg-blue-50 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300 origin-center"></div>
            </a>
            
            <a href="#contact" className="group relative px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors duration-300">
              <span className="relative z-10">Kontak</span>
              <div className="absolute inset-0 bg-blue-50 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300 origin-center"></div>
            </a>
          </div>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center space-x-3">
            <a href="login" className="px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors duration-300 font-medium">
              Masuk
            </a>
            <a href="/signup/" className="group relative px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5">
              <span className="relative z-10 flex items-center space-x-2">
                <span>Daftar Gratis</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden transition-all duration-300 ${
        isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      } overflow-hidden bg-white/95 backdrop-blur-lg border-t border-gray-200/20`}>
        <div className="px-6 py-4 space-y-3">
          <a href="#about" className="block py-2 text-gray-700 hover:text-blue-600 transition-colors duration-200">
            Tentang
          </a>
          <a href="#ai-diagnosis" className="block py-2 text-gray-700 hover:text-blue-600 transition-colors duration-200 pl-4">
            AI Diagnosis
          </a>
          <a href="#telemedicine" className="block py-2 text-gray-700 hover:text-blue-600 transition-colors duration-200 pl-4">
            Telemedicine
          </a>
          <a href="#community" className="block py-2 text-gray-700 hover:text-blue-600 transition-colors duration-200 pl-4">
            Komunitas
          </a>
          <a href="#pricing" className="block py-2 text-gray-700 hover:text-blue-600 transition-colors duration-200">
            Harga
          </a>
          <a href="#contact" className="block py-2 text-gray-700 hover:text-blue-600 transition-colors duration-200">
            Kontak
          </a>
          <div className="pt-4 border-t border-gray-200 space-y-3">
            <a href="#login" className="block py-2 text-gray-700 hover:text-blue-600 transition-colors duration-200">
              Masuk
            </a>
            <a href="#signup" className="block py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-center">
              Daftar Gratis
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default ModernNavbar;