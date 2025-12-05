import { Navbar } from "@/components/layout/Navbar";
import { HeroSection } from "@/components/home/HeroSection";
import { PillarsSection } from "@/components/home/PillarsSection";
import { CTASection } from "@/components/home/CTASection";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-16">
        <HeroSection />
        <PillarsSection />
        <CTASection />
      </main>
      <footer className="bg-card border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2024 NIRD - Numérique Inclusif Responsable Durable</p>
          <p className="mt-2">Tous les calculs sont transparents : 150kg CO₂/PC/an • 300€/licence</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
