import Navbar from '../sections/navbar';
import Hero from '../sections/hero';
import About from '../sections/about';
import Footer from '../sections/footer';



export default function HomePage() {
  return (
    <div className="text-foreground antialiased selection:bg-primary-DEFAULT/30 selection:text-primary-DEFAULT">
      <Navbar />
      <main>
        <Hero />
        <About /> 
      <Footer />
      </main>
    </div>
  );
}