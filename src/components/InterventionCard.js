'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Phone, Navigation, ChevronDown } from 'lucide-react';

export default function InterventionCard({ intervention }) {
  const [statut, setStatut] = useState(intervention.statut || 'En attente');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setStatut(newStatus);
    setIsUpdating(true);
    
    // Update in Supabase
    const { error } = await supabase
      .from('demande_devis')
      .update({ statut: newStatus })
      .eq('id', intervention.id);
      
    setIsUpdating(false);
    if (error) {
       console.error("Erreur lors de la mise à jour", error);
       setStatut(intervention.statut); // Revert on error
    }
  };

  // Status Color mappings
  let statusColor = 'bg-gray-100 text-gray-800 border-gray-200';
  if (statut.includes('Urgence') || statut.includes('Urgent')) {
    statusColor = 'bg-red-100 text-red-800 border-red-200';
  } else if (statut === 'En attente') {
    statusColor = 'bg-orange-100 text-orange-800 border-orange-200';
  } else if (statut === 'Planifié' || statut === 'PlanifiÃ©') {
    statusColor = 'bg-green-100 text-green-800 border-green-200';
  } else if (statut === 'Terminé' || statut === 'TerminÃ©') {
    statusColor = 'bg-blue-100 text-blue-800 border-blue-200';
  }

  // Formatting phone number string for href
  const phoneHref = intervention.telephone 
    ? `tel:${intervention.telephone.replace(/\s+/g, '')}` 
    : '#';

  const wazeHref = `https://waze.com/ul?q=${encodeURIComponent(intervention.adresse || '')}`;

  return (
    <div className="flex flex-col bg-white dark:bg-gray-950 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden h-full">
      <div className="p-5 flex-1">
        <div className="flex justify-between items-start mb-3 gap-2">
          <h3 className="font-bold text-lg text-gray-900 dark:text-white line-clamp-2 leading-tight">
            {intervention.probleme || 'Demande sans titre'}
          </h3>
          <span className={`px-2 py-1 text-[10px] uppercase font-bold rounded-full border ${statusColor} whitespace-nowrap`}>
            {statut}
          </span>
        </div>
        
        <div className="space-y-1">
          <p className="text-gray-900 dark:text-gray-100 font-medium text-sm">{intervention.nom || 'Client inconnu'}</p>
          <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2">{intervention.adresse || 'Adresse non renseignée'}</p>
        </div>
      </div>
      
      {/* Mobile-first Action Buttons with 44px min touch target */}
      <div className="grid grid-cols-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
        <a 
          href={phoneHref}
          className="flex flex-col items-center justify-center p-2 min-h-[55px] border-r border-gray-100 dark:border-gray-800 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
        >
          <Phone className="w-5 h-5 mb-1" />
          <span className="text-[10px] uppercase font-bold tracking-wider">Appeler</span>
        </a>
        
        <a 
          href={wazeHref}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center p-2 min-h-[55px] border-r border-gray-100 dark:border-gray-800 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
        >
          <Navigation className="w-5 h-5 mb-1" />
          <span className="text-[10px] uppercase font-bold tracking-wider">Trajet</span>
        </a>
        
        <div className="relative flex flex-col items-center justify-center min-h-[55px] text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors cursor-pointer">
          <select 
            value={statut}
            onChange={handleStatusChange}
            disabled={isUpdating}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          >
            <option value="Urgence">Urgence</option>
            <option value="En attente">En attente</option>
            <option value="Planifié">Planifié</option>
            <option value="En cours">En cours</option>
            <option value="Terminé">Terminé</option>
          </select>
          <div className="flex flex-col items-center justify-center pointer-events-none">
            {isUpdating ? (
              <span className="w-5 h-5 mb-1 animate-spin rounded-full border-2 border-gray-400 border-t-transparent" />
            ) : (
              <ChevronDown className="w-5 h-5 mb-1" />
            )}
            <span className="text-[10px] uppercase font-bold tracking-wider">Statut</span>
          </div>
        </div>
      </div>
    </div>
  );
}
