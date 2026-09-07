import './globals.css';
import Link from 'next/link';
import { Home, Map as MapIcon, LogOut, Settings } from 'lucide-react';

export const metadata = {
  title: 'Highgency CRM',
  description: 'CRM Métier - Optimisation des tournées et automatisation',
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className="flex h-screen overflow-hidden antialiased">
        
        {/* Sidebar Responsive - Desktop only for simplicity in basic layout, but mobile-first styling is applied */}
        <aside className="hidden md:flex flex-col w-64 border-r border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
          <div className="p-6">
            <h1 className="text-2xl font-bold tracking-tight text-blue-600 dark:text-blue-400">Highgency</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Espace Artisan</p>
          </div>
          
          <nav className="flex-1 px-4 space-y-2 mt-4">
            <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
              <Home className="w-5 h-5 text-gray-500" />
              <span className="font-medium">Tableau de Bord</span>
            </Link>
            <Link href="/map" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
              <MapIcon className="w-5 h-5 text-gray-500" />
              <span className="font-medium">Tournées (Carte)</span>
            </Link>
          </nav>
          
          <div className="p-4 border-t border-gray-200 dark:border-gray-800">
            <Link href="/settings" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors mb-2">
              <Settings className="w-5 h-5 text-gray-500" />
              <span className="font-medium">Paramètres</span>
            </Link>
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors text-left">
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Déconnexion</span>
            </button>
          </div>
        </aside>

        {/* Mobile Navigation Bar (Bottom) */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 flex justify-around p-3 z-50">
          <Link href="/dashboard" className="flex flex-col items-center gap-1 text-gray-600 dark:text-gray-400">
            <Home className="w-6 h-6" />
            <span className="text-xs">Accueil</span>
          </Link>
          <Link href="/map" className="flex flex-col items-center gap-1 text-gray-600 dark:text-gray-400">
            <MapIcon className="w-6 h-6" />
            <span className="text-xs">Carte</span>
          </Link>
          <Link href="/settings" className="flex flex-col items-center gap-1 text-gray-600 dark:text-gray-400">
            <Settings className="w-6 h-6" />
            <span className="text-xs">Paramètres</span>
          </Link>
        </nav>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto pb-16 md:pb-0 bg-white dark:bg-[#09090b]">
          {children}
        </main>
        
      </body>
    </html>
  );
}
