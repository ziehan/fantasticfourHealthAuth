'use client';

import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-blue-600">
          HealthHack
        </Link>
        <div className="space-x-4">
          <Link href="#about" className="text-gray-600 hover:text-blue-600">
            Tentang
          </Link>
          <Link href="#features" className="text-gray-600 hover:text-blue-600">
            Fitur
          </Link>
          <Link href="#login" className="text-white bg-blue-600 px-4 py-1.5 rounded hover:bg-blue-700">
            Masuk
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
