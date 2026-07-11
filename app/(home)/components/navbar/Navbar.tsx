'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo - Gauche */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image src="/logo.png" alt="CRM Micro SaaS" width={140} height={40} className="object-contain" priority />
            </Link>
          </div>

          {/* Centre Vide - Pour centrer les boutons à droite */}
          <div className="flex-1"></div>

          {/* Boutons à droite - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Contact commercial */}
            <Link
              href="/contact"
              className="px-5 py-2 text-sm font-medium text-gray-700 hover:text-[#1a4494] transition-colors border border-gray-300 rounded-md hover:border-[#1a4494]/50"
            >
              Contact commercial
            </Link>

            {/* Commencer - Bouton principal */}
            <Link
              href="/auth"
              className="px-6 py-2 bg-linear-to-r from-[#1a4494] to-[#f28224] text-white font-medium rounded-md hover:opacity-95 transition-opacity shadow-sm"
            >
              Commencer
            </Link>
          </div>

          {/* Menu Mobile Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-700"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Menu Mobile */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-6 space-y-4">
            <Link
              href="/contact"
              className="block px-4 py-3 text-center text-gray-700 font-medium border border-gray-300 rounded-md hover:border-[#1a4494]"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact commercial
            </Link>
            <Link
              href="/get-started"
              className="block px-4 py-3 text-center bg-linear-to-r from-[#1a4494] to-[#f28224] text-white font-medium rounded-md hover:opacity-95"
              onClick={() => setIsMenuOpen(false)}
            >
              Commencer
            </Link>
            <div className="pt-4 border-t border-gray-200">
              <p className="text-center text-sm text-gray-500">
                Déjà un compte ?{' '}
                <Link href="/login" className="text-[#1a4494] hover:underline">
                  Se connecter
                </Link>
              </p>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;