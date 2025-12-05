import { useState, useEffect } from "react";
import { Star, Medal, Trophy, Award, Crown, RefreshCw, Monitor, Leaf, Edit } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { etablissementService, Etablissement } from "@/services/etablissementService";

// Configuration des badges avec seuils
const BADGES_CONFIG = {
  starter: { label: "Débutant", icon: Star, color: "bg-gray-500", minLinux: 1, minPercent: 0, description: "Au moins 1 PC Linux" },
  bronze: { label: "Bronze", icon: Medal, color: "bg-amber-700", minLinux: 0, minPercent: 25, description: "25% des PC convertis" },
  silver: { label: "Argent", icon: Medal, color: "bg-gray-400", minLinux: 0, minPercent: 50, description: "50% des PC convertis" },
  gold: { label: "Or", icon: Trophy, color: "bg-yellow-500", minLinux: 0, minPercent: 75, description: "75% des PC convertis" },
  platinum: { label: "Platine", icon: Award, color: "bg-cyan-400", minLinux: 0, minPercent: 90, description: "90% des PC convertis" },
  champion: { label: "Champion", icon: Crown, color: "bg-purple-600", minLinux: 0, minPercent: 100, description: "100% des PC convertis" },
};

// Configuration des niveaux
const LEVELS_CONFIG = [
  { level: 1, name: "Novice", minPercent: 0, maxPercent: 10, color: "from-gray-400 to-gray-500", icon: "🌱" },
  { level: 2, name: "Apprenti", minPercent: 10, maxPercent: 25, color: "from-green-400 to-green-500", icon: "🌿" },
  { level: 3, name: "Explorateur", minPercent: 25, maxPercent: 40, color: "from-blue-400 to-blue-500", icon: "🔍" },
  { level: 4, name: "Aventurier", minPercent: 40, maxPercent: 55, color: "from-indigo-400 to-indigo-500", icon: "⚡" },
  { level: 5, name: "Expert", minPercent: 55, maxPercent: 70, color: "from-purple-400 to-purple-500", icon: "🎯" },
  { level: 6, name: "Maître", minPercent: 70, maxPercent: 85, color: "from-yellow-400 to-yellow-500", icon: "⭐" },
  { level: 7, name: "Champion", minPercent: 85, maxPercent: 95, color: "from-orange-400 to-orange-500", icon: "🏆" },
  { level: 8, name: "Légende", minPercent: 95, maxPercent: 100, color: "from-red-400 to-red-500", icon: "👑" },
  { level: 9, name: "Écologiste Ultime", minPercent: 100, maxPercent: 101, color: "from-emerald-400 to-emerald-600", icon: "🌍" },
];

const calculateLevel = (percentage: number) => {
  for (let i = LEVELS_CONFIG.length - 1; i >= 0; i--) {
    if (percentage >= LEVELS_CONFIG[i].minPercent) {
      return LEVELS_CONFIG[i];
    }
  }
  return LEVELS_CONFIG[0];
};

// Fonction pour calculer les badges dynamiquement
const calculateBadges = (pcWindows: number, pcLinux: number): string[] => {
  const total = pcWindows + pcLinux;
  if (total === 0) return [];
  
  const percentage = (pcLinux / total) * 100;
  const badges: string[] = [];
  
  // Les badges s'accumulent progressivement
  if (pcLinux >= 1) badges.push('starter');      // Au moins 1 PC Linux
  if (percentage >= 25) badges.push('bronze');   // 25% ou plus
  if (percentage >= 50) badges.push('silver');   // 50% ou plus
  if (percentage >= 75) badges.push('gold');     // 75% ou plus
  if (percentage >= 90) badges.push('platinum'); // 90% ou plus
  if (percentage === 100 && pcLinux > 0) badges.push('champion'); // 100%
  
  return badges;
};

const Village = () => {
  const [etablissements, setEtablissements] = useState<Etablissement[]>([]);
  const [loading, setLoading] = useState(true);
  const [converting, setConverting] = useState<string | null>(null);
  const [editingEtablissement, setEditingEtablissement] = useState<Etablissement | null>(null);
  const [editPcWindows, setEditPcWindows] = useState(0);
  const [editPcLinux, setEditPcLinux] = useState(0);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const loadEtablissements = async () => {
    setLoading(true);
    try {
      const data = await etablissementService.getAll();
      setEtablissements(data);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les établissements',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEtablissements();
  }, []);

  const handleConvertPc = async (id: string) => {
    setConverting(id);
    try {
      const updated = await etablissementService.convertPcToLinux(id);
      setEtablissements(prev => prev.map(e => e._id === id ? updated : e));
      toast({
        title: 'Succès',
        description: 'PC converti vers Linux !',
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de convertir le PC',
        variant: 'destructive',
      });
    } finally {
      setConverting(null);
    }
  };

  const openEditDialog = (etablissement: Etablissement) => {
    setEditingEtablissement(etablissement);
    setEditPcWindows(etablissement.pcWindows || 0);
    setEditPcLinux(etablissement.pcLinux || 0);
  };

  const handleSaveEdit = async () => {
    if (!editingEtablissement?._id) return;
    setSaving(true);
    try {
      const updated = await etablissementService.updatePc(editingEtablissement._id, editPcWindows, editPcLinux);
      setEtablissements(prev => prev.map(e => e._id === editingEtablissement._id ? updated : e));
      setEditingEtablissement(null);
      toast({
        title: 'Succès',
        description: 'Nombre de PC mis à jour !',
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de mettre à jour',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  // Calcul des statistiques globales
  const totalWindows = etablissements.reduce((acc, e) => acc + (e.pcWindows || 0), 0);
  const totalLinux = etablissements.reduce((acc, e) => acc + (e.pcLinux || 0), 0);
  const totalPc = totalWindows + totalLinux;
  const globalPercentage = totalPc > 0 ? Math.round((totalLinux / totalPc) * 100) : 0;
  const globalLevel = calculateLevel(globalPercentage);
  const globalBadges = calculateBadges(totalWindows, totalLinux);

  // Rendu des badges
  const renderBadges = (badges: string[]) => {
    if (badges.length === 0) return <p className="text-sm text-muted-foreground">Aucun badge encore</p>;
    
    return (
      <div className="flex flex-wrap gap-1">
        {badges.map((badge) => {
          const config = BADGES_CONFIG[badge as keyof typeof BADGES_CONFIG];
          if (!config) return null;
          const IconComponent = config.icon;
          return (
            <Badge key={badge} className={`${config.color} text-white`} title={config.description}>
              <IconComponent className="h-3 w-3 mr-1" />
              {config.label}
            </Badge>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-20 pb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Village NIRD</h1>
            <p className="text-muted-foreground mt-2">
              Suivez la progression de la migration vers Linux
            </p>
          </div>
          <Button variant="outline" onClick={loadEtablissements} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
        </div>

        {/* Stats globales */}
        <Card className={`mb-8 bg-gradient-to-r ${globalLevel.color} text-white`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <span className="text-3xl">{globalLevel.icon}</span>
              Niveau {globalLevel.level}: {globalLevel.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center bg-white/20 rounded-lg p-3">
                <Monitor className="h-6 w-6 mx-auto mb-1" />
                <p className="text-2xl font-bold">{totalWindows}</p>
                <p className="text-sm opacity-80">PC Windows</p>
              </div>
              <div className="text-center bg-white/20 rounded-lg p-3">
                <Leaf className="h-6 w-6 mx-auto mb-1" />
                <p className="text-2xl font-bold">{totalLinux}</p>
                <p className="text-sm opacity-80">PC Linux</p>
              </div>
              <div className="text-center bg-white/20 rounded-lg p-3">
                <p className="text-2xl font-bold">{globalPercentage}%</p>
                <p className="text-sm opacity-80">Convertis</p>
              </div>
              <div className="text-center bg-white/20 rounded-lg p-3">
                <p className="text-2xl font-bold">{globalBadges.length}</p>
                <p className="text-sm opacity-80">Badges</p>
              </div>
            </div>
            <Progress value={globalPercentage} className="h-3 bg-white/30" />
            
            {/* Badges globaux */}
            <div className="mt-4">
              <p className="text-sm mb-2 opacity-80">Badges obtenus :</p>
              {renderBadges(globalBadges)}
            </div>
          </CardContent>
        </Card>

        {/* Légende des badges */}
        <Card className="mb-8">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">🏅 Comment obtenir les badges ?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {Object.entries(BADGES_CONFIG).map(([key, config]) => {
                const IconComponent = config.icon;
                const isEarned = globalBadges.includes(key);
                return (
                  <div 
                    key={key} 
                    className={`p-3 rounded-lg border-2 text-center transition-all ${
                      isEarned 
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                        : 'border-gray-200 dark:border-gray-700 opacity-50'
                    }`}
                  >
                    <Badge className={`${config.color} text-white mb-2`}>
                      <IconComponent className="h-3 w-3 mr-1" />
                      {config.label}
                    </Badge>
                    <p className="text-xs text-muted-foreground">{config.description}</p>
                    {isEarned && <span className="text-green-500 text-xs">✓ Obtenu</span>}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Liste des établissements */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <RefreshCw className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : etablissements.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-muted-foreground">Aucun établissement trouvé</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {etablissements.map((etablissement) => {
              const pcWindows = etablissement.pcWindows || 0;
              const pcLinux = etablissement.pcLinux || 0;
              const total = pcWindows + pcLinux;
              const percentage = total > 0 ? Math.round((pcLinux / total) * 100) : 0;
              const level = calculateLevel(percentage);
              // Calculer les badges dynamiquement pour cet établissement
              const badges = calculateBadges(pcWindows, pcLinux);

              return (
                <Card key={etablissement._id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{etablissement.nom}</CardTitle>
                      <div className={`px-2 py-1 rounded-lg bg-gradient-to-r ${level.color} text-white text-sm`}>
                        {level.icon} Niv. {level.level}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{level.name}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm">
                        <span className="flex items-center gap-1">
                          <Monitor className="h-4 w-4 text-blue-500" />
                          {pcWindows} Windows
                        </span>
                        <span className="flex items-center gap-1">
                          <Leaf className="h-4 w-4 text-green-500" />
                          {pcLinux} Linux
                        </span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                      <p className="text-center text-sm font-medium">{percentage}% convertis</p>

                      {/* Badges calculés dynamiquement */}
                      <div className="min-h-[32px]">
                        {renderBadges(badges)}
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleConvertPc(etablissement._id!)}
                          disabled={pcWindows === 0 || converting === etablissement._id}
                          className="flex-1 bg-green-600 hover:bg-green-700"
                        >
                          {converting === etablissement._id ? (
                            <RefreshCw className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <Leaf className="h-4 w-4 mr-1" />
                              Convertir
                            </>
                          )}
                        </Button>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline" onClick={() => openEditDialog(etablissement)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Modifier {editingEtablissement?.nom}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label>PC Windows</Label>
                                <Input
                                  type="number"
                                  value={editPcWindows}
                                  onChange={(e) => setEditPcWindows(parseInt(e.target.value) || 0)}
                                  min={0}
                                />
                              </div>
                              <div>
                                <Label>PC Linux</Label>
                                <Input
                                  type="number"
                                  value={editPcLinux}
                                  onChange={(e) => setEditPcLinux(parseInt(e.target.value) || 0)}
                                  min={0}
                                />
                              </div>
                              
                              {/* Prévisualisation des badges */}
                              <div className="p-3 bg-muted rounded-lg">
                                <p className="text-sm font-medium mb-2">Aperçu des badges :</p>
                                {renderBadges(calculateBadges(editPcWindows, editPcLinux))}
                                <p className="text-xs text-muted-foreground mt-2">
                                  Niveau: {calculateLevel(
                                    (editPcWindows + editPcLinux) > 0 
                                      ? (editPcLinux / (editPcWindows + editPcLinux)) * 100 
                                      : 0
                                  ).icon} {calculateLevel(
                                    (editPcWindows + editPcLinux) > 0 
                                      ? (editPcLinux / (editPcWindows + editPcLinux)) * 100 
                                      : 0
                                  ).name}
                                </p>
                              </div>
                              
                              <Button onClick={handleSaveEdit} disabled={saving} className="w-full">
                                {saving ? <RefreshCw className="h-4 w-4 animate-spin" /> : 'Enregistrer'}
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default Village;
