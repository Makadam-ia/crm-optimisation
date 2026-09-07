'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet's default icon paths in Next.js
const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});

export default function Map({ interventions = [] }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-full bg-gray-100 dark:bg-gray-800 animate-pulse flex items-center justify-center rounded-xl">
        <span className="text-gray-400">Chargement de la carte...</span>
      </div>
    );
  }

  // Si on a des interventions, on centre sur la première, sinon on centre sur l'Hérault (Montpellier) par défaut
  const defaultCenter = interventions.length > 0 
    ? [interventions[0].lat, interventions[0].lng] 
    : [43.6108, 3.8767];

  return (
    <div className="w-full h-[500px] md:h-full rounded-xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-800 z-0 relative">
      <MapContainer 
        center={defaultCenter} 
        zoom={9} 
        scrollWheelZoom={true} 
        className="w-full h-full z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {interventions.map((intervention) => (
          <Marker 
            key={intervention.id} 
            position={[intervention.lat, intervention.lng]} 
            icon={icon}
          >
            <Popup>
              <div className="p-1 min-w-[200px]">
                <h3 className="font-bold text-gray-900">{intervention.probleme || 'Demande d&apos;intervention'}</h3>
                <p className="text-sm font-medium text-gray-700 mt-1">{intervention.nom}</p>
                <p className="text-sm text-gray-500 mt-1">{intervention.adresse}</p>
                <span className={`inline-block mt-3 px-2 py-1 text-xs rounded-full font-medium ${
                  intervention.statut === 'En attente' ? 'bg-amber-100 text-amber-700' : 
                  intervention.statut === 'Planifié' ? 'bg-blue-100 text-blue-700' : 
                  'bg-gray-200 text-gray-700'
                }`}>
                  {intervention.statut}
                </span>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}


