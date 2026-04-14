'use client';

import Link from 'next/link';
import { ArrowLeft, Home } from 'lucide-react';
import { useState } from 'react';

const AnimatedHomeButton = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      href="/"
      className="relative inline-flex items-center px-5 py-3 bg-linear-to-r from-blue-500 to-blue-600 text-white rounded-xl overflow-hidden group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Effet de fond animé */}
      <div className={`absolute inset-0 bg-linear-to-r from-blue-600 to-blue-600 transition-transform duration-300 ${isHovered ? 'translate-x-0' : '-translate-x-full'
        }`}></div>

      <div className="relative flex items-center">
        <ArrowLeft className={`w-5 h-5 mr-3 transition-transform duration-300 ${isHovered ? '-translate-x-1' : ''
          }`} />
        <span className="font-medium">Retour à l&apos;accueil</span>
        <Home className={`w-5 h-5 ml-3 transition-all duration-300 ${isHovered ? 'opacity-100 scale-110' : 'opacity-0 scale-50'
          }`} />
      </div>
    </Link>
  );
};

export default AnimatedHomeButton;