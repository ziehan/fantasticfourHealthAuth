
      module.exports = {
        content: [
          "./pages/**/*.{js,ts,jsx,tsx,mdx}",
          "./components/**/*.{js,ts,jsx,tsx,mdx}", // Jika Anda punya folder components
          "./app/**/*.{js,ts,jsx,tsx,mdx}", // Jika menggunakan App Router
        ],
        theme: {
          extend: {},
        },
        plugins: [
          require('@tailwindcss/line-clamp'), // WAJIB untuk kelas line-clamp-*
        ],
      }


      // tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}", // Jika menggunakan App Router
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slower': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite', // Contoh dari sebelumnya
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' }, // Sesuaikan jarak float jika perlu
        }
        // Keyframes untuk 'pulse' akan menggunakan default Tailwind jika tidak di-override.
      }
    },
  },
  plugins: [
    // require('@tailwindcss/line-clamp'), // Jika Anda menggunakan line-clamp
  ],
};