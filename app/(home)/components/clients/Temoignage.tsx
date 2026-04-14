const Temoignage = () => {
  return (
    <div className="max-w-3xl mx-auto text-center bg-linear-to-br from-gray-50 to-white rounded-2xl p-12 border border-gray-100 shadow-sm">
      <div className="text-4xl text-gray-300 mb-6">&quot;</div>
      <blockquote className="text-2xl font-light text-gray-700 mb-8 leading-relaxed">
        Grâce à cette plateforme, nous avons augmenté notre productivité de 40%
        et amélioré significativement la collaboration entre nos équipes commerciales.
      </blockquote>
      <div className="flex items-center justify-center space-x-4">
        <div className="w-12 h-12 bg-linear-to-r from-blue-500 to-blue-6000 rounded-full"></div>
        <div className="text-left">
          <div className="font-semibold text-gray-900">Jean Martin</div>
          <div className="text-gray-600">Directeur Commercial, Sanofi</div>
        </div>
      </div>
    </div>
  )
}

export default Temoignage
