'use client';
import React from 'react';
import { 
  Heart, 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin,
  Youtube,
  Zap,
  Shield,
  Users,
  ArrowUp,
  Send
} from 'lucide-react';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
      </div>
      
      <div className="relative z-10">
        {/* Newsletter Section */}
        <div className="border-b border-gray-700/50 bg-gradient-to-r from-blue-600/10 to-purple-600/10 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Dapatkan Tips Kesehatan Terbaru
              </h3>
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                Berlangganan newsletter kami untuk mendapatkan artikel kesehatan, tips wellness, dan update terbaru dari HealthHack.
              </p>
              <div className="flex flex-col sm:flex-row max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Masukkan email Anda"
                  className="flex-1 px-4 py-3 bg-white/10 backdrop-blur-sm border border-gray-600 rounded-l-xl sm:rounded-r-none rounded-r-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button className="group px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-r-xl sm:rounded-l-none rounded-l-xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 mt-2 sm:mt-0">
                  <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Company Info */}
            <div className="lg:col-span-1">
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  HealthHack
                </span>
              </div>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Platform kesehatan digital terdepan yang menggabungkan teknologi AI dengan layanan medis profesional untuk kesehatan yang lebih baik.
              </p>
              
              {/* Social Media */}
              <div className="flex space-x-4">
                {[
                  { icon: Facebook, href: "#", color: "hover:text-blue-500" },
                  { icon: Twitter, href: "#", color: "hover:text-sky-400" },
                  { icon: Instagram, href: "#", color: "hover:text-pink-500" },
                  { icon: Linkedin, href: "#", color: "hover:text-blue-600" },
                  { icon: Youtube, href: "#", color: "hover:text-red-500" }
                ].map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className={`w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 ${social.color} transition-all duration-300 hover:scale-110 hover:bg-gray-700`}
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Products */}
            <div>
              <h4 className="text-lg font-semibold mb-6 text-white">Layanan</h4>
              <ul className="space-y-4">
                {[
                  { name: "AI Diagnosis", icon: Zap, desc: "Deteksi dini penyakit" },
                  { name: "Telemedicine", icon: Shield, desc: "Konsultasi online" },
                  { name: "Komunitas", icon: Users, desc: "Forum kesehatan" },
                  { name: "Health Tracker", icon: Heart, desc: "Monitor kesehatan" }
                ].map((item, index) => (
                  <li key={index}>
                    <a href="#" className="group flex items-start space-x-3 text-gray-300 hover:text-white transition-colors duration-300">
                      <div className="w-6 h-6 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center mt-0.5 group-hover:scale-110 transition-transform duration-300">
                        <item.icon className="w-3.5 h-3.5 text-blue-400" />
                      </div>
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-gray-400">{item.desc}</div>
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-lg font-semibold mb-6 text-white">Sumber Daya</h4>
              <ul className="space-y-4">
                {[
                  "Blog Kesehatan",
                  "Panduan Wellness",
                  "FAQ",
                  "Webinar",
                  "Download App",
                  "API Documentation"
                ].map((item, index) => (
                  <li key={index}>
                    <a href="#" className="text-gray-300 hover:text-white transition-colors duration-300 hover:translate-x-1 transform inline-block">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-lg font-semibold mb-6 text-white">Kontak</h4>
              <ul className="space-y-4">
                <li className="flex items-center space-x-3 text-gray-300">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-lg flex items-center justify-center">
                    <Phone className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <div className="font-medium text-white">+62 21 1234 5678</div>
                    <div className="text-sm text-gray-400">Senin - Jumat, 08:00-17:00</div>
                  </div>
                </li>
                <li className="flex items-center space-x-3 text-gray-300">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center">
                    <Mail className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <div className="font-medium text-white">hello@healthhack.id</div>
                    <div className="text-sm text-gray-400">Respon dalam 24 jam</div>
                  </div>
                </li>
                <li className="flex items-start space-x-3 text-gray-300">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center mt-1">
                    <MapPin className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <div className="font-medium text-white">Jakarta, Indonesia</div>
                    <div className="text-sm text-gray-400">Gedung Cyber 2, Kuningan</div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700/50 bg-black/20 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
                <p className="text-gray-400 text-sm">
                  © {new Date().getFullYear()} HealthHack by FantasticFour. All rights reserved.
                </p>
                <div className="flex items-center space-x-4 text-sm">
                  <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                    Privacy Policy
                  </a>
                  <span className="text-gray-600">•</span>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                    Terms of Service
                  </a>
                  <span className="text-gray-600">•</span>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                    Cookies
                  </a>
                </div>
              </div>
              
              {/* Back to Top */}
              <button
                onClick={scrollToTop}
                className="group flex items-center space-x-2 text-gray-400 hover:text-white transition-all duration-300 hover:-translate-y-1"
              >
                <span className="text-sm">Kembali ke atas</span>
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-blue-500 group-hover:to-purple-500 transition-all duration-300">
                  <ArrowUp className="w-4 h-4 group-hover:text-white" />
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;