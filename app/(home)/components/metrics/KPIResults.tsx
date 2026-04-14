const MeasurableResultsCorporate = () => {
  const results = [
    {
      value: '+20–35%',
      label: 'Résolution au premier contact',
      trend: 'positive',
      color: 'text-green-600',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      )
    },
    {
      value: '−15–30%',
      label: 'Temps moyen de traitement',
      trend: 'improvement',
      color: 'text-blue-600',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      value: '+60%',
      label: 'Productivité des agents',
      trend: 'positive',
      color: 'text-blue-600',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    {
      value: '−20%',
      label: 'Coût par interaction',
      trend: 'improvement',
      color: 'text-amber-600',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  ];

  return (
    <div className="bg-white">
      <div className="max-w-6xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        {/* En-tête avec ligne décorative */}
        <div className="text-center mb-12">
          <div className="inline-block mb-6">
            <div className="h-1 w-20 bg-linear-to-r from-blue-500 to-blue-6000 mx-auto rounded-full"></div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Impact Business Quantifié
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Analyse comparative des performances avant/après déploiement sur une cohorte de 500 clients.
          </p>
        </div>

        {/* Grille de résultats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {results.map((item, index) => (
            <div
              key={index}
              className="relative group"
            >
              {/* Carte */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-lg transition-all duration-300 h-full">
                {/* Icone */}
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-lg ${item.color.replace('text-', 'bg-')} bg-opacity-10 mb-4`}>
                  <div className={item.color}>
                    {item.icon}
                  </div>
                </div>

                {/* Valeur */}
                <div className={`text-3xl font-bold ${item.color} mb-2`}>
                  {item.value}
                </div>

                {/* Libellé */}
                <h3 className="text-base font-semibold text-gray-900 mb-3">
                  {item.label}
                </h3>

                {/* Indicateur de performance */}
                <div className="flex items-center">
                  <div className={`w-full h-2 rounded-full ${item.trend === 'positive' ? 'bg-green-100' : 'bg-blue-100'
                    }`}>
                    <div
                      className={`h-full rounded-full ${item.trend === 'positive'
                        ? 'bg-linear-to-r from-green-400 to-green-500'
                        : 'bg-linear-to-r from-blue-400 to-blue-500'
                        }`}
                      style={{
                        width: item.trend === 'positive'
                          ? item.value.includes('60') ? '60%' : '30%'
                          : item.value.includes('30') ? '30%' : '20%'
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Effet de fond décoratif */}
              <div className="absolute -inset-1 bg-linear-to-r from-blue-50 to-blue-600 rounded-xl opacity-0 group-hover:opacity-50 -z-10 transition-opacity duration-300"></div>
            </div>
          ))}
        </div>

        {/* Note méthodologique */}
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <div className="flex items-start">
            <div className="shrink-0">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-1">
                Méthodologie de mesure
              </h4>
              <p className="text-sm text-gray-600">
                Les résultats présentés sont basés sur une étude comparative réalisée sur 12 mois
                auprès de 500 entreprises ayant déployé notre solution. Les variations observées
                dépendent du périmètre fonctionnel, de la maturité digitale et des processus
                d&apos;adoption déployés par chaque organisation.
              </p>
            </div>
          </div>
        </div>

        {/* Call to action discret */}
        <div className="mt-8 text-center">
          <a
            href="#contact"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium group"
          >
            Discuter de vos objectifs spécifiques
            <svg
              className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};

export default MeasurableResultsCorporate;