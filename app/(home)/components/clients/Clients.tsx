"use client"
import Image from 'next/image';

const TrustedClients = () => {
  const clients = [
    { name: 'Uber', logo: '/logos/uber.png' },
    { name: 'Welcome to the Jungle', logo: '/logos/wttj_logo.png' },
    { name: 'Carrefour', logo: '/logos/carrefour.png' },
    { name: 'sanofi', logo: '/logos/sanofi.png' },
    { name: 'RENAULT', logo: '/logos/renault_group.png' },
    { name: 'ENGIE', logo: '/logos/engie_logo.png' },
    { name: 'leboncoin', logo: '/logos/leboncoin.png' },
    { name: 'BNP PARIBAS', logo: '/logos/bnpparibas.avif' },
    { name: 'Coca-Cola', logo: '/logos/coca_cola.png' },
  ];

  return (
    <section className="py-20 bg-linear-to-b from-white to-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête avec statistique */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-linear-to-r from-blue-500 to-blue-6000 blur-xl opacity-20 rounded-full"></div>
              <div className="relative text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900">
                245,000+
              </div>
            </div>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Entreprises de confiance
            <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-blue-600">
              à travers le monde
            </span>
          </h2>

          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Rejoignez les leaders d&apos;industrie qui font confiance à nos solutions pour transformer leur gestion commerciale.
          </p>
        </div>

        {/* Grille de logos professionnelle */}
        <div className="relative mb-16">
          {/* Effet de dégradé sur les bords */}
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-linear-to-r from-white to-transparent z-10"></div>
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-linear-to-l from-white to-transparent z-10"></div>

          <div className="flex overflow-x-hidden py-4">
            <div className="flex animate-slide">
              {[...clients, ...clients].map((client, index) => (
                <div
                  key={index}
                  className="shrink-0 mx-4 w-44 h-32 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
                >
                  <div className="relative w-full h-full p-6 flex items-center justify-center">
                    <div className="relative w-full h-12">
                      <Image
                        src={client.logo}
                        alt={client.name}
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 100px, 150px"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats en colonnes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center p-8 rounded-2xl bg-white shadow-lg border border-gray-100">
            <div className="text-4xl font-bold text-blue-600 mb-2">99%</div>
            <div className="text-lg font-semibold text-gray-900 mb-2">Taux de satisfaction</div>
            <p className="text-gray-600">Clients satisfaits par notre support</p>
          </div>

          <div className="text-center p-8 rounded-2xl bg-white shadow-lg border border-gray-100">
            <div className="text-4xl font-bold text-blue-600 mb-2">150+</div>
            <div className="text-lg font-semibold text-gray-900 mb-2">Pays desservis</div>
            <p className="text-gray-600">Présence internationale mondiale</p>
          </div>

          <div className="text-center p-8 rounded-2xl bg-white shadow-lg border border-gray-100">
            <div className="text-4xl font-bold text-green-600 mb-2">24/7</div>
            <div className="text-lg font-semibold text-gray-900 mb-2">Support disponible</div>
            <p className="text-gray-600">Assistance client en continu</p>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-6 bg-linear-to-r from-blue-50 to-blue-600 rounded-3xl p-8 border border-blue-100">
            <div className="text-left">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Prêt à transformer votre entreprise ?
              </h3>
              <p className="text-gray-600">
                Rejoignez des milliers d&apos;entreprises qui font déjà confiance à notre plateforme.
              </p>
            </div>
            <div className="shrink-0">
              <button className="px-8 py-3 bg-linear-to-r from-blue-600 to-blue-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5">
                Demander une démo
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        
        .animate-slide {
          animation: slide 30s linear infinite;
          display: flex;
        }
        
        .animate-slide:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};

export default TrustedClients;