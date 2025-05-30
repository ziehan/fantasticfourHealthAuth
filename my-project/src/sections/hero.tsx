'use client';

const Hero = () => {
  return (
    <section className="bg-blue-50 py-20 text-center">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-blue-800 mb-4">
          Solusi Digital untuk SDM Kesehatan Indonesia
        </h1>
        <p className="text-lg text-gray-700 mb-6">
          Bantu atasi burnout, distribusi tidak merata, dan krisis kesiapsiagaan dengan teknologi.
        </p>
        <a
          href="#login"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition"
        >
          Mulai Sekarang
        </a>
      </div>
    </section>
  );
};

export default Hero;
