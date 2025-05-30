'use client';

import React from 'react';
import { 
  Target, 
  Heart, 
  Shield, 
  Award,
  Zap,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

const About = () => {
  return (
    <section id="about" className="py-20 bg-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 bg-blue-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-purple-500 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Heart className="w-4 h-4" />
            <span>Tentang HealthHack</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-gray-900">Revolusi</span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Sistem Kesehatan
            </span>
            <br />
            <span className="text-gray-900">Indonesia</span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Timmm inovator yang membangun teknologi untuk mengatasi tantangan 
            distribusi SDM dan burnout tenaga medis di Indonesia.
          </p>
        </div>

        {/* Mission & Vision Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Mission Card */}
          <div className="group bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-gray-200/20 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Target className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Misi Kami</h3>
            <p className="text-gray-600 leading-relaxed mb-6">
              Membangun ekosistem kesehatan digital yang menyelesaikan 
              distribusi SDM tidak merata dan mencegah burnout tenaga medis.
            </p>
            <div className="space-y-3">
              {[
                "Teknologi AI untuk diagnosis",
                "Platform telemedicine terpadu", 
                "Sistem monitoring kesehatan"
              ].map((item, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Vision Card */}
          <div className="group bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-gray-200/20 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Award className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Visi Kami</h3>
            <p className="text-gray-600 leading-relaxed mb-6">
              Menjadi platform kesehatan digital #1 di Indonesia yang 
              meningkatkan kualitas hidup masyarakat melalui inovasi teknologi.
            </p>
            <div className="space-y-3">
              {[
                "Akses kesehatan merata",
                "Tenaga medis sejahtera",
                "Masyarakat Indonesia sehat"
              ].map((item, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Core Values */}
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-8">Nilai-Nilai Kami</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Heart,
                title: "Empati",
                desc: "Memahami kebutuhan tenaga medis dan pasien",
                color: "from-red-500 to-pink-500"
              },
              {
                icon: Zap,
                title: "Inovasi",
                desc: "Teknologi terdepan untuk solusi kesehatan",
                color: "from-blue-500 to-cyan-500"
              },
              {
                icon: Shield,
                title: "Integritas",
                desc: "Komitmen pada keamanan dan privasi data",
                color: "from-green-500 to-emerald-500"
              }
            ].map((value, index) => (
              <div key={index} className="group">
                <div className={`w-20 h-20 bg-gradient-to-br ${value.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <value.icon className="w-10 h-10 text-white" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h4>
                <p className="text-gray-600">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 md:p-12 text-white">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold mb-4">Dampak Kami</h3>
            <p className="text-blue-100 text-lg">
              Angka yang menunjukkan komitmen kami pada kesehatan Indonesia
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: "50K+", label: "Tenaga Medis" },
              { number: "1M+", label: "Pasien Terlayani" },
              { number: "500+", label: "Rumah Sakit" },
              { number: "98%", label: "Satisfaction Rate" }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold mb-2">{stat.number}</div>
                <div className="text-blue-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Siap Bergabung dengan Revolusi Kesehatan?
          </h3>
          <p className="text-gray-600 mb-8">
            Jadilah bagian dari solusi untuk sistem kesehatan Indonesia yang lebih baik.
          </p>
          <a
            href="#signup"
            className="group inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-xl hover:shadow-blue-500/25 hover:-translate-y-1 transition-all duration-300"
          >
            <span>Bergabung Sekarang</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default About;