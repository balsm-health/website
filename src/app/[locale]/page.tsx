import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <main className="flex-1" role="main">
          <Hero />
          <Features />
        </main>
        <Footer />
      </div>
    </>
  );
}
