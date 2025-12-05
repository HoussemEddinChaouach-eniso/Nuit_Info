import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Gamepad2, Map, ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center gradient-hero overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-nird-sun/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-accent-foreground text-sm font-medium mb-6 animate-slide-up">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse-soft" />
            Numérique Inclusif Responsable Durable
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6 animate-slide-up" style={{ animationDelay: "0.1s" }}>
            Construisez un numérique{" "}
            <span className="text-gradient">plus responsable</span>
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            Migrez vos établissements vers Linux, réduisez votre empreinte carbone 
            et rejoignez une communauté engagée pour un numérique durable.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: "0.3s" }}>
            <Button asChild variant="nature" size="xl">
              <Link to="/village" className="flex items-center gap-2">
                <Gamepad2 className="w-5 h-5" />
                Jouer à Mon Village
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button asChild variant="meadow" size="xl">
              <Link to="/carte" className="flex items-center gap-2">
                <Map className="w-5 h-5" />
                Voir la Carte
              </Link>
            </Button>
          </div>

          {/* Stats preview */}
          <div className="grid grid-cols-3 gap-4 mt-16 max-w-lg mx-auto animate-slide-up" style={{ animationDelay: "0.4s" }}>
            {[
              { value: "150kg", label: "CO₂ / PC / an" },
              { value: "300€", label: "Économie / licence" },
              { value: "100%", label: "Autonomie numérique" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-primary">{stat.value}</div>
                <div className="text-xs sm:text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
