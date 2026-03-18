import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      <div className="flex-1">
        <Hero />
        <Features />
      </div>
      <Footer />
    </main>
  );
}
