'use client';

const Footer = () => {
  return (
    <footer className="bg-gray-100 py-6 mt-20 text-center">
      <p className="text-gray-500 text-sm">
        © {new Date().getFullYear()} FantasticFour Health. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
