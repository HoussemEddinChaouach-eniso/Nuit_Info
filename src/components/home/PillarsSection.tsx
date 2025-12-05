import { Leaf, Users, Shield } from "lucide-react";

const pillars = [
  {
    icon: Leaf,
    title: "Durabilité",
    description: "Réduisez l'empreinte carbone de votre parc informatique en prolongeant la durée de vie de vos équipements grâce à Linux.",
    color: "bg-primary/10 text-primary",
    stats: "150kg CO₂ économisés par PC",
  },
  {
    icon: Users,
    title: "Inclusion",
    description: "Offrez à tous un accès égal au numérique avec des logiciels libres, gratuits et accessibles sans barrière financière.",
    color: "bg-nird-sky/10 text-nird-sky",
    stats: "300€ d'économie par licence",
  },
  {
    icon: Shield,
    title: "Responsabilité",
    description: "Reprenez le contrôle de vos données et de votre infrastructure avec des solutions transparentes et souveraines.",
    color: "bg-nird-earth/10 text-nird-earth",
    stats: "100% de souveraineté numérique",
  },
];

export function PillarsSection() {
  return (
    <section className="py-24 bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Les 3 piliers de la démarche NIRD
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Une approche globale pour transformer votre établissement vers un numérique plus responsable.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {pillars.map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className="group relative bg-background rounded-2xl p-8 shadow-soft hover:shadow-card transition-all duration-500 hover:-translate-y-2"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`w-14 h-14 rounded-xl ${pillar.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold mb-3">{pillar.title}</h3>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {pillar.description}
                </p>
                <div className="pt-4 border-t border-border">
                  <span className="text-sm font-semibold text-primary">{pillar.stats}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
