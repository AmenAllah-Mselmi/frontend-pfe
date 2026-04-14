import Link from 'next/link';
import { Button } from '@/components/ui/button'; // Si vous utilisez des composants UI

export default function NotFound() {
  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white flex items-center justify-center p-4">
      <div className="max-w-lg w-full text-center">
        {/* 404 Number */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-gray-300 opacity-50">
            404
          </h1>
        </div>

        {/* Message */}
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Page introuvable
        </h2>
        
        <p className="text-gray-600 mb-8 text-lg">
          La page que vous recherchez n&apos;existe pas ou a été déplacée.
          <br />
          Retournez à votre tableau de bord pour continuer à gérer vos leads.
        </p>

        {/* Actions */}
        <div className="space-y-4 max-w-xs mx-auto">
          <Link href="/" className="block">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              Retour au page principale
            </Button>
          </Link>

          {/* Search or Contact */}
          <div className="pt-6 border-t border-gray-200 mt-6">
            <p className="text-gray-600 text-sm mb-4">
              Vous cherchez quelque chose en particulier ?
            </p>
            <div className="flex gap-2">
              <Link 
                href="/search" 
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Rechercher dans le CRM
              </Link>
              <span className="text-gray-300">•</span>
              <Link 
                href="/help" 
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Centre d&apos;aide
              </Link>
            </div>
          </div>
        </div>

     
        </div>
      </div>
  );
}