import { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Monitor, Leaf, PiggyBank, Shield, Zap, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

const CO2_PER_PC = 150; // kg CO₂ per year
const COST_PER_LICENSE = 300; // euros
const MIGRATION_MESSAGES = [
  "🌱 Bravo ! Chaque PC compte.",
  "🚀 Vous prenez de l'avance !",
  "🌍 Impact environnemental notable !",
  "💪 Votre établissement montre l'exemple !",
  "🏆 Leader de la transition numérique !",
];

export function VillageGame() {
  const [totalPCs, setTotalPCs] = useState(50);
  const [migratedPCs, setMigratedPCs] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const percentMigrated = totalPCs > 0 ? Math.round((migratedPCs / totalPCs) * 100) : 0;
  const co2Saved = migratedPCs * CO2_PER_PC;
  const moneySaved = migratedPCs * COST_PER_LICENSE;

  const messageIndex = Math.min(
    Math.floor(percentMigrated / 20),
    MIGRATION_MESSAGES.length - 1
  );

  const handleMigrate = () => {
    if (migratedPCs < totalPCs) {
      setIsAnimating(true);
      setMigratedPCs((prev) => Math.min(prev + 1, totalPCs));
      setTimeout(() => setIsAnimating(false), 300);
    }
  };

  const handleMigrateAll = () => {
    setMigratedPCs(totalPCs);
  };

  const handleReset = () => {
    setMigratedPCs(0);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Village Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">
          Mon Village Numérique
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Migrez progressivement votre parc informatique vers Linux et visualisez 
          votre impact en temps réel.
        </p>
      </div>

      {/* Configuration */}
      <div className="bg-card rounded-2xl p-6 shadow-soft mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
            <Monitor className="w-5 h-5 text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-semibold">Taille du parc informatique</h3>
            <p className="text-sm text-muted-foreground">Nombre total de PC dans votre établissement</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Slider
            value={[totalPCs]}
            onValueChange={([value]) => {
              setTotalPCs(value);
              setMigratedPCs(Math.min(migratedPCs, value));
            }}
            max={500}
            min={10}
            step={10}
            className="flex-1"
          />
          <span className="text-2xl font-bold text-primary w-20 text-right">{totalPCs}</span>
        </div>
      </div>

      {/* Village Visualization */}
      <div className="bg-card rounded-2xl p-8 shadow-soft mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold">Visualisation du parc</h3>
          <span className="text-lg font-semibold text-primary">
            {migratedPCs} / {totalPCs} migrés
          </span>
        </div>

        {/* PC Grid */}
        <div className="grid grid-cols-10 gap-2 mb-8 p-4 bg-muted rounded-xl">
          {Array.from({ length: Math.min(totalPCs, 100) }).map((_, i) => {
            const isMigrated = i < Math.round((migratedPCs / totalPCs) * Math.min(totalPCs, 100));
            return (
              <div
                key={i}
                className={cn(
                  "aspect-square rounded-lg transition-all duration-300 flex items-center justify-center",
                  isMigrated
                    ? "bg-primary shadow-sm"
                    : "bg-muted-foreground/20"
                )}
              >
                <Monitor className={cn(
                  "w-3 h-3 sm:w-4 sm:h-4",
                  isMigrated ? "text-primary-foreground" : "text-muted-foreground/50"
                )} />
              </div>
            );
          })}
        </div>

        {/* Progress Bar */}
        <div className="relative h-4 bg-muted rounded-full overflow-hidden mb-4">
          <div
            className="absolute inset-y-0 left-0 gradient-nature rounded-full transition-all duration-500"
            style={{ width: `${percentMigrated}%` }}
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {percentMigrated}% migré vers Linux
          </span>
          <span className={cn(
            "text-sm font-medium transition-all",
            isAnimating && "animate-count-up"
          )}>
            {MIGRATION_MESSAGES[messageIndex]}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap justify-center gap-4 mb-12">
        <Button
          variant="nature"
          size="lg"
          onClick={handleMigrate}
          disabled={migratedPCs >= totalPCs}
        >
          <Zap className="w-4 h-4" />
          Migrer un PC
        </Button>
        <Button
          variant="meadow"
          size="lg"
          onClick={handleMigrateAll}
          disabled={migratedPCs >= totalPCs}
        >
          Tout migrer
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={handleReset}
          disabled={migratedPCs === 0}
        >
          <RotateCcw className="w-4 h-4" />
          Réinitialiser
        </Button>
      </div>

      {/* Impact Counters */}
      <div className="grid sm:grid-cols-3 gap-6">
        <ImpactCard
          icon={Leaf}
          value={`${co2Saved.toLocaleString()} kg`}
          label="CO₂ économisé / an"
          description="150 kg par PC migré"
          color="primary"
        />
        <ImpactCard
          icon={PiggyBank}
          value={`${moneySaved.toLocaleString()} €`}
          label="Économies réalisées"
          description="300€ par licence Windows"
          color="sun"
        />
        <ImpactCard
          icon={Shield}
          value={`${percentMigrated}%`}
          label="Autonomie numérique"
          description="Souveraineté des données"
          color="sky"
        />
      </div>
    </div>
  );
}

interface ImpactCardProps {
  icon: React.ElementType;
  value: string;
  label: string;
  description: string;
  color: "primary" | "sun" | "sky";
}

function ImpactCard({ icon: Icon, value, label, description, color }: ImpactCardProps) {
  const colorClasses = {
    primary: "bg-primary/10 text-primary",
    sun: "bg-nird-sun/10 text-nird-sun",
    sky: "bg-nird-sky/10 text-nird-sky",
  };

  return (
    <div className="bg-card rounded-2xl p-6 shadow-soft hover:shadow-card transition-shadow">
      <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-4", colorClasses[color])}>
        <Icon className="w-6 h-6" />
      </div>
      <div className="text-3xl font-bold mb-1">{value}</div>
      <div className="font-medium text-foreground mb-1">{label}</div>
      <div className="text-sm text-muted-foreground">{description}</div>
    </div>
  );
}
