import { create } from 'zustand';

export const useMapStore = create((set) => ({
  selectedInterventionId: null,
  selectedLocation: null, // { lat, lng }
  setSelectedIntervention: (id, lat, lng) => 
    set({ selectedInterventionId: id, selectedLocation: { lat, lng } }),
  clearSelection: () => 
    set({ selectedInterventionId: null, selectedLocation: null }),
}));
