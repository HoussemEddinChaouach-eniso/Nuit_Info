import { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { EtablissementForm } from '@/components/etablissement/EtablissementForm';
import { etablissementService, Etablissement } from '@/services/etablissementService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, MapPin, Building, RefreshCw, Plus, Monitor } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const Carte = () => {
  const [etablissements, setEtablissements] = useState<Etablissement[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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

  const handleDelete = async (id: string) => {
    try {
      await etablissementService.delete(id);
      setEtablissements((prev) => prev.filter((e) => e._id !== id));
      toast({
        title: 'Succès',
        description: 'Établissement supprimé',
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer',
        variant: 'destructive',
      });
    }
  };

  const handleSuccess = (newEtablissement: Etablissement) => {
    setEtablissements((prev) => [...prev, newEtablissement]);
    setIsDialogOpen(false);
  };

  const getTypeBadgeColor = (type: string) => {
    const colors: Record<string, string> = {
      ecole: 'bg-blue-500',
      college: 'bg-green-500',
      lycee: 'bg-purple-500',
      universite: 'bg-orange-500',
      entreprise: 'bg-red-500',
      association: 'bg-yellow-500',
      autre: 'bg-gray-500',
    };
    return colors[type] || 'bg-gray-500';
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Ajout de pt-20 pour compenser la navbar fixe */}
      <main className="container mx-auto px-4 pt-20 pb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Carte des Établissements
            </h1>
            <p className="text-muted-foreground mt-2">
              {etablissements.length} établissement(s) enregistré(s)
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={loadEtablissements} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Actualiser
            </Button>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Nouvel établissement</DialogTitle>
                </DialogHeader>
                <EtablissementForm onSuccess={handleSuccess} />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <RefreshCw className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : etablissements.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Building className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Aucun établissement</h3>
              <p className="text-muted-foreground mb-4">
                Commencez par ajouter votre premier établissement
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un établissement
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {etablissements.map((etablissement) => (
              <Card key={etablissement._id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{etablissement.nom}</CardTitle>
                    <Badge className={`${getTypeBadgeColor(etablissement.type)} text-white`}>
                      {etablissement.type}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    {etablissement.adresse && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{etablissement.adresse}</span>
                      </div>
                    )}
                    {etablissement.ville && (
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4" />
                        <span>
                          {etablissement.ville}
                          {etablissement.codePostal && ` (${etablissement.codePostal})`}
                        </span>
                      </div>
                    )}
                    {(etablissement.pcWindows !== undefined || etablissement.pcLinux !== undefined) && (
                      <div className="flex items-center gap-2">
                        <Monitor className="h-4 w-4" />
                        <span>
                          {etablissement.pcWindows || 0} Windows / {etablissement.pcLinux || 0} Linux
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-end mt-4">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => etablissement._id && handleDelete(etablissement._id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Supprimer
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Carte;