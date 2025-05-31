import Navbar from '../sections/navbar';
import Hero from '../sections/hero';
import About from '../sections/about';
import Footer from '../sections/footer';
import Faq from '../sections/faq';


export default function HomePage() {
  return (
    <div className="text-foreground antialiased selection:bg-primary-DEFAULT/30 selection:text-primary-DEFAULT">
      <Navbar />
      <main>
        <Hero />
        <About /> 
        <Faq />
      <Footer />
      </main>
    </div>
  );
}