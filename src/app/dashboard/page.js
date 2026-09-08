import { Suspense } from 'react';
import { supabase } from '@/lib/supabase';
import { Calendar, CheckCircle2, Clock, MapPin } from 'lucide-react';
import InterventionCard from '@/components/InterventionCard';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Tableau de Bord | Highgency' };

async function getDashboardStats() {
  try {
    const { data: demandes, error } = await supabase.from('demande_devis').select('statut');
    if (error) return { chantiersActifs: 0, tourneesDuJour: 0, aFacturer: 0 };
    
    // Normalisation des chaînes pour éviter les soucis d'encodage
    const chantiersActifs = demandes.filter(d => d.statut === 'En attente' || d.statut === 'En cours').length;
    const tourneesDuJour = demandes.filter(d => d.statut === 'Planifié' || d.statut === 'PlanifiÃ©').length;
    const aFacturer = demandes.filter(d => d.statut === 'Terminé' || d.statut === 'TerminÃ©').length;
    
    return { chantiersActifs, tourneesDuJour, aFacturer };
  } catch (err) {
    return { chantiersActifs: 0, tourneesDuJour: 0, aFacturer: 0 };
  }
}

async function getRecentInterventions() {
  try {
    // Ajout de "telephone" dans le select si présent dans la base
    const { data, error } = await supabase
      .from('demande_devis')
      .select('id, nom, adresse, probleme, statut, telephone, created_at')
      .order('created_at', { ascending: false })
      .limit(6);
    return error ? [] : (data || []);
  } catch (err) {
    return [];
  }
}

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {[1, 2, 3].map((i) => (
        <div key={i} className="p-6 rounded-xl bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 shadow-sm animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2 mb-4"></div>
          <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-1/4"></div>
        </div>
      ))}
    </div>
  );
}

async function StatsCards() {
  const stats = await getDashboardStats();
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div className="p-6 rounded-xl bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="flex items-center gap-3 text-gray-500 mb-2">
          <Clock className="w-5 h-5 text-blue-500" />
          <h3 className="font-medium">Demandes en cours</h3>
        </div>
        <p className="text-3xl font-bold">{stats.chantiersActifs}</p>
      </div>
      <div className="p-6 rounded-xl bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="flex items-center gap-3 text-gray-500 mb-2">
          <MapPin className="w-5 h-5 text-green-500" />
          <h3 className="font-medium">Planifiées (Tournées)</h3>
        </div>
        <p className="text-3xl font-bold">{stats.tourneesDuJour}</p>
      </div>
      <div className="p-6 rounded-xl bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="flex items-center gap-3 text-gray-500 mb-2">
          <CheckCircle2 className="w-5 h-5 text-amber-500" />
          <h3 className="font-medium">À facturer</h3>
        </div>
        <p className="text-3xl font-bold">{stats.aFacturer}</p>
      </div>
    </div>
  );
}

async function InterventionsList() {
  const interventions = await getRecentInterventions();
  if (interventions.length === 0) return <p className="text-gray-500 italic p-3">Aucune demande récente trouvée.</p>;

  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-gray-50/50 dark:bg-gray-900/50">
      {interventions.map((intervention) => (
        <InterventionCard key={intervention.id} intervention={intervention} />
      ))}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <header className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Bonjour, Artisan 👋</h1>
        <p className="text-gray-500">Voici le résumé de votre activité d&apos;aujourd&apos;hui.</p>
      </header>
      
      <Suspense fallback={<StatsSkeleton />}>
        <StatsCards />
      </Suspense>
      
      <div className="mt-8">
        <section className="bg-white dark:bg-gray-950 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-500" />
            <h2 className="font-bold">Dernières Demandes (n8n)</h2>
          </div>
          <Suspense fallback={<div className="p-4 animate-pulse"><div className="h-32 bg-gray-200 dark:bg-gray-800 rounded-xl"></div></div>}>
            <InterventionsList />
          </Suspense>
        </section>
      </div>
    </div>
  );
}
