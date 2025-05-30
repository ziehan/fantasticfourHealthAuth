'use client';

import React from 'react';
import { 
  ArrowRight, 
  Play, 
  Heart, 
  Shield, 
  Users, 
  Zap,
  Star,
  CheckCircle 
} from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-purple-200/40 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-pink-200/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Star className="w-4 h-4" />
                <span>#1 Platform Kesehatan Digital Indonesia</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                <span className="text-gray-900">Revolusi</span>
                <br />
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                  SDM Kesehatan
                </span>
                <br />
                <span className="text-gray-900">Indonesia</span>
              </h1>

              {/* Subtitle */}
              <p className="text-xl text-gray-600 mb-8 max-w-lg mx-auto lg:mx-0">
                Atasi burnout, distribusi tidak merata, dan krisis kesiapsiagaan 
                dengan teknologi AI terdepan.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
                <a
                  href="#signup"
                  className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/25 hover:-translate-y-1"
                >
                  <span className="relative z-10 flex items-center justify-center">
                    <span>Mulai Sekarang</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </a>
                
                <button className="group flex items-center space-x-3 px-8 py-4 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl font-semibold text-gray-700 hover:bg-white hover:shadow-lg transition-all duration-300">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <Play className="w-4 h-4 text-white ml-0.5" />
                  </div>
                  <span>Lihat Demo</span>
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-8 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>50,000+ Tenaga Medis</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>24/7 Support</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>ISO 27001 Certified</span>
                </div>
              </div>
            </div>

            {/* Right Content - Feature Cards */}
            <div className="relative">
              <div className="grid grid-cols-2 gap-6">
                {/* AI Diagnosis Card */}
                <div className="group bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-gray-200/20 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">AI Diagnosis</h3>
                  <p className="text-sm text-gray-600">
                    Deteksi dini penyakit dengan akurasi 95%
                  </p>
                </div>

                {/* Telemedicine Card */}
                <div className="group bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-gray-200/20 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 mt-8">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">Telemedicine</h3>
                  <p className="text-sm text-gray-600">
                    Konsultasi online kapan saja
                  </p>
                </div>

                {/* Community Card */}
                <div className="group bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-gray-200/20 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 -mt-8">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">Komunitas</h3>
                  <p className="text-sm text-gray-600">
                    Network profesional kesehatan
                  </p>
                </div>

                {/* Health Monitoring Card */}
                <div className="group bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-gray-200/20 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">Monitoring</h3>
                  <p className="text-sm text-gray-600">
                    Pantau kesehatan real-time
                  </p>
                </div>
              </div>

              {/* Floating Stats */}
              <div className="absolute -top-4 -right-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-2xl shadow-xl">
                <div className="text-2xl font-bold">98%</div>
                <div className="text-xs opacity-90">Satisfaction Rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 w-full">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-16">
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            className="fill-white"
          ></path>
        </svg>
      </div>
    </section>
  );
};

export default Hero;