const API_URL = 'http://localhost:3001/api';

export interface Etablissement {
  _id?: string;
  nom: string;
  type: string;
  adresse?: string;
  ville?: string;
  codePostal?: string;
  latitude?: number;
  longitude?: number;
  description?: string;
  pcWindows?: number;
  pcLinux?: number;
  badges?: string[];
  contact?: {
    email?: string;
    telephone?: string;
    siteWeb?: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

export interface GlobalStats {
  totalPcWindows: number;
  totalPcLinux: number;
  totalEtablissements: number;
  etablissementsChampion: number;
  progressPercentage: number;
}

export const etablissementService = {
  async getAll(): Promise<Etablissement[]> {
    try {
      const response = await fetch(`${API_URL}/etablissements`);
      if (!response.ok) throw new Error('Erreur lors de la récupération');
      return response.json();
    } catch (error) {
      console.error('Erreur API:', error);
      return [];
    }
  },

  async getById(id: string): Promise<Etablissement | null> {
    try {
      const response = await fetch(`${API_URL}/etablissements/${id}`);
      if (!response.ok) throw new Error('Erreur lors de la récupération');
      return response.json();
    } catch (error) {
      console.error('Erreur API:', error);
      return null;
    }
  },

  async create(etablissement: Omit<Etablissement, '_id'>): Promise<Etablissement> {
    const response = await fetch(`${API_URL}/etablissements`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(etablissement),
    });
    if (!response.ok) throw new Error('Erreur lors de la création');
    return response.json();
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/etablissements/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Erreur lors de la suppression');
  },

  async update(id: string, etablissement: Partial<Etablissement>): Promise<Etablissement> {
    const response = await fetch(`${API_URL}/etablissements/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(etablissement),
    });
    if (!response.ok) throw new Error('Erreur lors de la mise à jour');
    return response.json();
  },

  async updatePc(id: string, pcWindows: number, pcLinux: number): Promise<Etablissement> {
    const response = await fetch(`${API_URL}/etablissements/${id}/update-pc`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pcWindows, pcLinux }),
    });
    if (!response.ok) throw new Error('Erreur lors de la mise à jour des PC');
    return response.json();
  },

  async convertPcToLinux(id: string): Promise<Etablissement> {
    const response = await fetch(`${API_URL}/etablissements/${id}/convert-pc`, {
      method: 'PATCH',
    });
    if (!response.ok) throw new Error('Erreur lors de la conversion');
    return response.json();
  },

  async getStats(): Promise<GlobalStats> {
    const response = await fetch(`${API_URL}/stats`);
    if (!response.ok) throw new Error('Erreur lors de la récupération des stats');
    return response.json();
  },
};