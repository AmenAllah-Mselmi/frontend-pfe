'use client';

import { Mail, Phone, Users } from 'lucide-react';

interface ContactFormFieldsProps {
  formData: {
    firstName: string;
    lastName: string;
    email: string;
    jobTitle: string;
    phone: string;
    company: string;
    companySize: string;
    interest: string;
    message: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onInterestSelect: (interest: string) => void;
}

const ContactFormFields = ({ formData, onChange, onInterestSelect }: ContactFormFieldsProps) => {
  const companySizes = [
    '1-10 employés',
    '11-50 employés',
    '51-200 employés',
    '201-500 employés',
    '501-1000 employés',
    '1000+ employés'
  ];

  const interests = [
    'Gestion de projets',
    'CRM et vente',
    'Marketing',
    'Ressources Humaines',
    'Développement logiciel',
    'Automatisation des processus',
    'Autre'
  ];

  return (
    <div className="space-y-6">
      {/* Nom et Prénom */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Prénom <span className="text-[#FF375E]">*</span>
          </label>
          <input
            type="text"
            name="firstName"
            required
            value={formData.firstName}
            onChange={onChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF375E]/20 focus:border-[#FF375E] transition-colors"
            placeholder="Votre prénom"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Nom <span className="text-[#FF375E]">*</span>
          </label>
          <input
            type="text"
            name="lastName"
            required
            value={formData.lastName}
            onChange={onChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF375E]/20 focus:border-[#FF375E] transition-colors"
            placeholder="Votre nom"
          />
        </div>
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          E-mail professionnel <span className="text-[#FF375E]">*</span>
        </label>
        <div className="relative">
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
            <Mail className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={onChange}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF375E]/20 focus:border-[#FF375E] transition-colors"
            placeholder="nom@entreprise.com"
          />
        </div>
      </div>

      {/* Titre du poste */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Intitulé du poste
        </label>
        <input
          type="text"
          name="jobTitle"
          value={formData.jobTitle}
          onChange={onChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF375E]/20 focus:border-[#FF375E] transition-colors"
          placeholder="Ex: Responsable Commercial"
        />
      </div>

      {/* Téléphone */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Téléphone
        </label>
        <div className="relative">
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
            <Phone className="w-5 h-5 text-gray-400" />
          </div>
          <div className="absolute left-12 top-1/2 transform -translate-y-1/2">
            <span className="text-gray-500">+216</span>
          </div>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={onChange}
            className="w-full pl-24 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF375E]/20 focus:border-[#FF375E] transition-colors"
            placeholder="XX XXX XXX"
          />
        </div>
      </div>

      {/* Entreprise */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Nom de l&apos;entreprise <span className="text-[#FF375E]">*</span>
          </label>
          <input
            type="text"
            name="company"
            required
            value={formData.company}
            onChange={onChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF375E]/20 focus:border-[#FF375E] transition-colors"
            placeholder="Nom de votre entreprise"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Taille de l&apos;entreprise <span className="text-[#FF375E]">*</span>
          </label>
          <select
          title="Taille de l\'entreprise"
            name="companySize"
            required
            value={formData.companySize}
            onChange={onChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF375E]/20 focus:border-[#FF375E] transition-colors appearance-none bg-white"
          >
            <option value="">Sélectionnez...</option>
            {companySizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Intérêt */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Sur quoi souhaitez-vous en savoir plus ? <span className="text-[#FF375E]">*</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {interests.map((interest) => (
            <button
              key={interest}
              type="button"
              onClick={() => onInterestSelect(interest)}
              className={`px-4 py-3 text-sm rounded-lg border transition-colors ${
                formData.interest === interest
                  ? 'border-[#FF375E] bg-[#FF375E]/10 text-[#FF375E]'
                  : 'border-gray-300 hover:border-[#FF375E]/50'
              }`}
            >
              {interest}
            </button>
          ))}
        </div>
      </div>

      {/* Message */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-2" />
            Parlez-nous de votre équipe et du travail que vous aimeriez gérer avec monday.com
          </div>
        </label>
        <textarea
          name="message"
          value={formData.message}
          onChange={onChange}
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF375E]/20 focus:border-[#FF375E] transition-colors resize-none"
          placeholder="Décrivez vos besoins, vos équipes et vos objectifs..."
        />
      </div>
    </div>
  );
};

export default ContactFormFields;