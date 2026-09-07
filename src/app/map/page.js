import nextDynamic from 'next/dynamic';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Tournées | Highgency',
};

// Dynamic import with ssr: false to prevent "window is not defined" error from Leaflet
const MapWithNoSSR = nextDynamic(() => import('@/components/Map'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[500px] bg-gray-100 dark:bg-gray-800 animate-pulse flex items-center justify-center rounded-xl">
      <span className="text-gray-400 font-medium">Chargement de la carte des tournées...</span>
    </div>
  ),
});

// Fetch locations from Supabase
async function getInterventionsMap() {
  try {
    // Only select rows that have been geocoded (lat and lng are not null)
    const { data, error } = await supabase
      .from('demande_devis')
      .select('id, nom, adresse, probleme, statut, lat, lng')
      .not('lat', 'is', null)
      .not('lng', 'is', null);

    if (error) {
      console.error("Erreur lors de la récupération des données de la carte:", error);
      return [];
    }
    return data || [];
  } catch (err) {
    console.error("Exception lors de la récupération de la carte:", err);
    return [];
  }
}

export default async function MapPage() {
  // Fetch the real data from your table
  const interventions = await getInterventionsMap();

  return (
    <div className="flex flex-col h-full md:h-[calc(100vh-2rem)] p-4 md:p-8">
      <header className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Optimisation des Tournées</h1>
          <p className="text-gray-500">
            {interventions.length} intervention(s) géolocalisée(s) sur la carte.
          </p>
        </div>
      </header>

      <div className="flex-1 min-h-[500px] relative">
        <MapWithNoSSR interventions={interventions} />
      </div>
    </div>
  );
}
