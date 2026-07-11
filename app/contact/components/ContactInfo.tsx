import BenefitList from './BenefitList';
import TestimonialCard from './TestimonialCard';

const ContactInfo = () => {
  const benefits = [
    'Identifiez la solution répondant le mieux à vos besoins',
    'Bénéficiez d\'une tarification sur mesure',
    'Découvrez comment optimiser vos processus de travail inter-équipes'
  ];

  return (
    <div>
      {/* En-tête */}
      <div className="mb-10">
        <div className="inline-flex items-center space-x-2 mb-4">
          <div className="w-2 h-2 bg-linear-to-r from-[#1a4494] to-[#f28224] rounded-full"></div>
          <span className="text-sm font-semibold text-[#1a4494] uppercase tracking-wider">
            Contact Commercial
          </span>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          Construisez votre solution
          <span className="block text-[#1a4494]">CRM MICRO SAAS</span>
        </h1>
        
        <p className="text-lg text-gray-600 mb-8">
          Discutez avec nos experts pour créer une solution sur mesure 
          adaptée aux besoins spécifiques de votre entreprise.
        </p>
      </div>

      {/* Avantages */}
      <BenefitList benefits={benefits} />

      {/* Témoignage */}
      <TestimonialCard
        quote="Avec CRM MICRO SAAS, on a une vision centralisée et partagée par projet, par statut d'avancement et par niveau de priorisation, avec des informations structurées et uniformes."
        author="Marc Chassagnette"
        position="Responsable de la Transformation Finance France"
        company="Carrefour"
        initials="MC"
      />

      {/* Note */}
      <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-100">
        <div className="flex items-start">
          <div className="shrink-0">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-blue-600 text-lg">ℹ️</span>
            </div>
          </div>
          <div className="ml-4">
            <h4 className="font-semibold text-gray-900 mb-1">
              Questions techniques ou de facturation ?
            </h4>
            <p className="text-sm text-gray-600">
              Pour toute question technique ou liée à la facturation, 
              rendez-vous dans notre{' '}
              <a href="/help" className="text-[#1a4494] hover:underline font-medium">
                centre d&apos;aide
              </a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;