import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-lg">
        Skip to main content
      </a>
      <div className="flex flex-col min-h-screen">
        <main id="main-content" className="flex-1" role="main">
          <Hero />
          <Features />
        </main>
        <Footer />
      </div>
    </>
  );
}
