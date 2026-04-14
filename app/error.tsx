'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button'; // Si vous utilisez des composants UI
import Link from 'next/link';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log l'erreur à un service de monitoring
    console.error('CRM Application Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* Logo/Icon */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full">
            <svg 
              className="w-10 h-10 text-red-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" 
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Une erreur est survenue
        </h1>

        {/* Error Message */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left">
          <p className="text-red-800 font-medium mb-2">Détails de l&apos;erreur :</p>
          <code className="text-sm text-red-600 break-all">
            {error.message || 'Une erreur inattendue s\'est produite'}
          </code>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          <Button
            onClick={() => reset()}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            Réessayer
          </Button>

          <div className="flex gap-4">
            <Link href="/" className="flex-1">
              <Button variant="outline" className="w-full">
                Page Principale
              </Button>
            </Link>
          </div>

          {/* Support */}
          <div className="pt-6 border-t border-gray-200 mt-6">
            <p className="text-gray-600 text-sm mb-2">
              Si l&apos;erreur persiste, contactez le support technique.
            </p>
            <div className="flex justify-center gap-4">
              <Link 
                href="mailto:support@crm-saas.com" 
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                support@crm-saas.com
              </Link>
              <span className="text-gray-300">•</span>
              <Link 
                href="/contact" 
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                Page de contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}