```javascript
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
      ```
