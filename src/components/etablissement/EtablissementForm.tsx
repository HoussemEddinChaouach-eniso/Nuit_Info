import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { etablissementService, Etablissement } from '@/services/etablissementService';
import { useToast } from '@/hooks/use-toast';
import { Monitor, Leaf } from 'lucide-react';

interface EtablissementFormProps {
  onSuccess?: (etablissement: Etablissement) => void;
}

export function EtablissementForm({ onSuccess }: EtablissementFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    type: '',
    adresse: '',
    ville: '',
    codePostal: '',
    latitude: '',
    longitude: '',
    description: '',
    email: '',
    telephone: '',
    siteWeb: '',
    pcWindows: '0',
    pcLinux: '0',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTypeChange = (value: string) => {
    setFormData((prev) => ({ ...prev, type: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const etablissement = await etablissementService.create({
        nom: formData.nom,
        type: formData.type,
        adresse: formData.adresse,
        ville: formData.ville,
        codePostal: formData.codePostal,
        latitude: formData.latitude ? parseFloat(formData.latitude) : undefined,
        longitude: formData.longitude ? parseFloat(formData.longitude) : undefined,
        description: formData.description,
        pcWindows: parseInt(formData.pcWindows) || 0,
        pcLinux: parseInt(formData.pcLinux) || 0,
        contact: {
          email: formData.email,
          telephone: formData.telephone,
          siteWeb: formData.siteWeb,
        },
      });

      toast({
        title: 'Succès',
        description: 'Établissement enregistré avec succès !',
      });

      // Réinitialiser le formulaire
      setFormData({
        nom: '',
        type: '',
        adresse: '',
        ville: '',
        codePostal: '',
        latitude: '',
        longitude: '',
        description: '',
        email: '',
        telephone: '',
        siteWeb: '',
        pcWindows: '0',
        pcLinux: '0',
      });

      onSuccess?.(etablissement);
    } catch (error) {
      toast({
        title: 'Erreur',
        description: "Erreur lors de l'enregistrement",
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Calcul de l'aperçu
  const pcWindowsNum = parseInt(formData.pcWindows) || 0;
  const pcLinuxNum = parseInt(formData.pcLinux) || 0;
  const totalPc = pcWindowsNum + pcLinuxNum;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Ajouter un nouvel établissement</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nom">Nom *</Label>
              <Input
                id="nom"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Type *</Label>
              <Select value={formData.type} onValueChange={handleTypeChange} required>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ecole">École</SelectItem>
                  <SelectItem value="college">Collège</SelectItem>
                  <SelectItem value="lycee">Lycée</SelectItem>
                  <SelectItem value="universite">Université</SelectItem>
                  <SelectItem value="entreprise">Entreprise</SelectItem>
                  <SelectItem value="association">Association</SelectItem>
                  <SelectItem value="autre">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="adresse">Adresse</Label>
              <Input
                id="adresse"
                name="adresse"
                value={formData.adresse}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ville">Ville</Label>
              <Input
                id="ville"
                name="ville"
                value={formData.ville}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="codePostal">Code postal</Label>
              <Input
                id="codePostal"
                name="codePostal"
                value={formData.codePostal}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telephone">Téléphone</Label>
              <Input
                id="telephone"
                name="telephone"
                value={formData.telephone}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="siteWeb">Site web</Label>
              <Input
                id="siteWeb"
                name="siteWeb"
                value={formData.siteWeb}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Section PC */}
          <div className="border rounded-lg p-4 bg-muted/50">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Monitor className="h-5 w-5" />
              Parc informatique
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pcWindows" className="flex items-center gap-2">
                  <Monitor className="h-4 w-4 text-blue-600" />
                  Nombre de PC Windows
                </Label>
                <Input
                  id="pcWindows"
                  name="pcWindows"
                  type="number"
                  min="0"
                  value={formData.pcWindows}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pcLinux" className="flex items-center gap-2">
                  <Leaf className="h-4 w-4 text-green-600" />
                  Nombre de PC Linux
                </Label>
                <Input
                  id="pcLinux"
                  name="pcLinux"
                  type="number"
                  min="0"
                  value={formData.pcLinux}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Aperçu */}
            {totalPc > 0 && (
              <div className="mt-4 p-3 bg-background rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">Aperçu :</p>
                <div className="flex gap-4 text-sm">
                  <span className="text-blue-600 font-medium">
                    {pcWindowsNum} Windows
                  </span>
                  <span className="text-green-600 font-medium">
                    {pcLinuxNum} Linux
                  </span>
                  <span className="text-muted-foreground">
                    = {totalPc} PC total
                  </span>
                </div>
                {pcLinuxNum > 0 && (
                  <p className="text-xs text-green-600 mt-2">
                    🌱 Potentiel CO2 économisé: {pcLinuxNum * 50} kg/an
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
            />
          </div>

          {/* Coordonnées GPS (optionnel, plié par défaut) */}
          <details className="border rounded-lg p-4">
            <summary className="cursor-pointer font-medium text-sm text-muted-foreground">
              Coordonnées GPS (optionnel)
            </summary>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="latitude">Latitude</Label>
                <Input
                  id="latitude"
                  name="latitude"
                  type="number"
                  step="any"
                  value={formData.latitude}
                  onChange={handleChange}
                  placeholder="ex: 48.8566"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="longitude">Longitude</Label>
                <Input
                  id="longitude"
                  name="longitude"
                  type="number"
                  step="any"
                  value={formData.longitude}
                  onChange={handleChange}
                  placeholder="ex: 2.3522"
                />
              </div>
            </div>
          </details>

          <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={loading}>
            {loading ? 'Enregistrement...' : 'Enregistrer l\'établissement'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}