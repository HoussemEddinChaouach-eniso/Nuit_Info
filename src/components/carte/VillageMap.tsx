import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Plus, Trophy, Users, Leaf, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Village {
  id: number;
  name: string;
  location: string;
  pcs: number;
  migrated: number;
}

const initialVillages: Village[] = [
  { id: 1, name: "Lycée Jean Jaurès", location: "Toulouse", pcs: 200, migrated: 150 },
  { id: 2, name: "Collège Victor Hugo", location: "Paris", pcs: 120, migrated: 80 },
  { id: 3, name: "École Marie Curie", location: "Lyon", pcs: 80, migrated: 60 },
  { id: 4, name: "Lycée Louis Pasteur", location: "Bordeaux", pcs: 180, migrated: 100 },
  { id: 5, name: "Collège Albert Camus", location: "Marseille", pcs: 100, migrated: 45 },
];

export function VillageMap() {
  const [villages, setVillages] = useState<Village[]>(initialVillages);
  const [newVillage, setNewVillage] = useState({ name: "", location: "", pcs: "" });
  const [isFormOpen, setIsFormOpen] = useState(false);

  const sortedVillages = [...villages].sort(
    (a, b) => (b.migrated / b.pcs) - (a.migrated / a.pcs)
  );

  const totalPCs = villages.reduce((sum, v) => sum + v.pcs, 0);
  const totalMigrated = villages.reduce((sum, v) => sum + v.migrated, 0);
  const totalCO2 = totalMigrated * 150;

  const handleAddVillage = () => {
    if (!newVillage.name || !newVillage.location || !newVillage.pcs) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    const village: Village = {
      id: Date.now(),
      name: newVillage.name,
      location: newVillage.location,
      pcs: parseInt(newVillage.pcs),
      migrated: 0,
    };

    setVillages([...villages, village]);
    setNewVillage({ name: "", location: "", pcs: "" });
    setIsFormOpen(false);
    toast.success("Établissement ajouté avec succès !");
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">
          Carte des Résistants
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Rejoignez la communauté des établissements engagés pour un numérique responsable.
        </p>
      </div>

      {/* National Stats */}
      <div className="grid sm:grid-cols-4 gap-4 mb-12">
        <StatCard
          icon={Users}
          value={villages.length}
          label="Établissements"
          color="primary"
        />
        <StatCard
          icon={TrendingUp}
          value={`${totalMigrated.toLocaleString()}`}
          label="PC migrés"
          color="sky"
        />
        <StatCard
          icon={Leaf}
          value={`${(totalCO2 / 1000).toFixed(1)}t`}
          label="CO₂ économisé"
          color="forest"
        />
        <StatCard
          icon={Trophy}
          value={`${Math.round((totalMigrated / totalPCs) * 100)}%`}
          label="Taux national"
          color="sun"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Ranking */}
        <div className="lg:col-span-2">
          <div className="bg-card rounded-2xl shadow-soft overflow-hidden">
            <div className="p-6 border-b border-border">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Trophy className="w-5 h-5 text-nird-sun" />
                Classement des Villages
              </h2>
            </div>
            <div className="divide-y divide-border">
              {sortedVillages.map((village, index) => {
                const percent = Math.round((village.migrated / village.pcs) * 100);
                return (
                  <div key={village.id} className="p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm",
                        index === 0 && "bg-nird-sun/20 text-nird-sun",
                        index === 1 && "bg-muted text-muted-foreground",
                        index === 2 && "bg-nird-earth/20 text-nird-earth",
                        index > 2 && "bg-muted text-muted-foreground"
                      )}>
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold truncate">{village.name}</span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {village.location}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full gradient-nature transition-all duration-500"
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-primary w-12 text-right">
                            {percent}%
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{village.migrated}/{village.pcs}</div>
                        <div className="text-xs text-muted-foreground">PC migrés</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Add Village Form */}
        <div>
          <div className="bg-card rounded-2xl p-6 shadow-soft mb-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-primary" />
              Ajouter votre établissement
            </h2>
            
            {isFormOpen ? (
              <div className="space-y-4">
                <Input
                  placeholder="Nom de l'établissement"
                  value={newVillage.name}
                  onChange={(e) => setNewVillage({ ...newVillage, name: e.target.value })}
                />
                <Input
                  placeholder="Ville"
                  value={newVillage.location}
                  onChange={(e) => setNewVillage({ ...newVillage, location: e.target.value })}
                />
                <Input
                  type="number"
                  placeholder="Nombre de PC"
                  value={newVillage.pcs}
                  onChange={(e) => setNewVillage({ ...newVillage, pcs: e.target.value })}
                />
                <div className="flex gap-2">
                  <Button variant="nature" onClick={handleAddVillage} className="flex-1">
                    Ajouter
                  </Button>
                  <Button variant="outline" onClick={() => setIsFormOpen(false)}>
                    Annuler
                  </Button>
                </div>
              </div>
            ) : (
              <Button variant="meadow" onClick={() => setIsFormOpen(true)} className="w-full">
                <Plus className="w-4 h-4" />
                Rejoindre la communauté
              </Button>
            )}
          </div>

          {/* Why Join */}
          <div className="bg-accent rounded-2xl p-6">
            <h3 className="font-bold mb-4">Pourquoi rejoindre NIRD ?</h3>
            <ul className="space-y-3 text-sm">
              {[
                "Réduisez votre empreinte carbone",
                "Économisez sur les licences logicielles",
                "Rejoignez une communauté engagée",
                "Partagez votre expérience",
                "Inspirez d'autres établissements",
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                    <Leaf className="w-3 h-3 text-primary" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  icon: React.ElementType;
  value: string | number;
  label: string;
  color: "primary" | "sky" | "forest" | "sun";
}

function StatCard({ icon: Icon, value, label, color }: StatCardProps) {
  const colorClasses = {
    primary: "bg-primary/10 text-primary",
    sky: "bg-nird-sky/10 text-nird-sky",
    forest: "bg-nird-forest/10 text-nird-forest",
    sun: "bg-nird-sun/10 text-nird-sun",
  };

  return (
    <div className="bg-card rounded-xl p-4 shadow-soft">
      <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center mb-3", colorClasses[color])}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
}
