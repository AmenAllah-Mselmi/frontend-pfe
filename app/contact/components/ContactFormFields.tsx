'use client';

import { Mail, Phone, Users } from 'lucide-react';
import FormField from '@/components/Form/FormField';

interface ContactFormFieldsProps {
  form: any;
  onInterestSelect: (interest: string) => void;
}

const ContactFormFields = ({ form, onInterestSelect }: ContactFormFieldsProps) => {
  const { values, errors, touched, handleChange, handleBlur } = form;

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
        <FormField
          label="Prénom"
          name="firstName"
          error={errors.firstName}
          touched={touched.firstName}
          required
        >
          <input
            type="text"
            placeholder="Votre prénom"
            value={values.firstName}
            onChange={(e) => handleChange('firstName', e.target.value)}
            onBlur={() => handleBlur('firstName')}
          />
        </FormField>
        <FormField
          label="Nom"
          name="lastName"
          error={errors.lastName}
          touched={touched.lastName}
          required
        >
          <input
            type="text"
            placeholder="Votre nom"
            value={values.lastName}
            onChange={(e) => handleChange('lastName', e.target.value)}
            onBlur={() => handleBlur('lastName')}
          />
        </FormField>
      </div>

      {/* Email */}
      <FormField
        label="E-mail professionnel"
        name="email"
        error={errors.email}
        touched={touched.email}
        icon={Mail}
        required
      >
        <input
          type="email"
          placeholder="nom@entreprise.com"
          value={values.email}
          onChange={(e) => handleChange('email', e.target.value)}
          onBlur={() => handleBlur('email')}
        />
      </FormField>

      {/* Titre du poste */}
      <FormField
        label="Intitulé du poste"
        name="jobTitle"
        error={errors.jobTitle}
        touched={touched.jobTitle}
      >
        <input
          type="text"
          placeholder="Ex: Responsable Commercial"
          value={values.jobTitle}
          onChange={(e) => handleChange('jobTitle', e.target.value)}
          onBlur={() => handleBlur('jobTitle')}
        />
      </FormField>

      {/* Téléphone */}
      <FormField
        label="Téléphone"
        name="phone"
        error={errors.phone}
        touched={touched.phone}
        icon={Phone}
      >
        <div className="relative w-full">
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
            <span className="text-gray-500 font-medium">+216</span>
          </div>
          <input
            type="tel"
            className="pl-16" // Adjust padding for the prefix
            placeholder="XX XXX XXX"
            value={values.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            onBlur={() => handleBlur('phone')}
          />
        </div>
      </FormField>

      {/* Entreprise */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <FormField
          label="Nom de l'entreprise"
          name="company"
          error={errors.company}
          touched={touched.company}
          required
        >
          <input
            type="text"
            placeholder="Nom de votre entreprise"
            value={values.company}
            onChange={(e) => handleChange('company', e.target.value)}
            onBlur={() => handleBlur('company')}
          />
        </FormField>
        <FormField
          label="Taille de l'entreprise"
          name="companySize"
          error={errors.companySize}
          touched={touched.companySize}
          required
        >
          <select
            value={values.companySize}
            onChange={(e) => handleChange('companySize', e.target.value)}
            onBlur={() => handleBlur('companySize')}
            className="appearance-none"
          >
            <option value="">Sélectionnez...</option>
            {companySizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </FormField>
      </div>

      {/* Intérêt */}
      <FormField
        label="Sur quoi souhaitez-vous en savoir plus ?"
        name="interest"
        error={errors.interest}
        touched={touched.interest}
        required
      >
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {interests.map((interest) => (
            <button
              key={interest}
              type="button"
              onClick={() => onInterestSelect(interest)}
              className={`px-4 py-3 text-xs sm:text-sm rounded-xl border transition-all duration-200 font-medium ${
                values.interest === interest
                  ? 'border-[#1a4494] bg-[#1a4494]/5 text-[#1a4494] shadow-sm'
                  : 'border-gray-200 hover:border-[#1a4494]/30 text-gray-600'
              }`}
            >
              {interest}
            </button>
          ))}
        </div>
      </FormField>

      {/* Message */}
      <FormField
        label="Votre message"
        name="message"
        error={errors.message}
        touched={touched.message}
        icon={Users}
      >
        <textarea
          placeholder="Décrivez vos besoins, vos équipes et vos objectifs..."
          rows={4}
          value={values.message}
          onChange={(e) => handleChange('message', e.target.value)}
          onBlur={() => handleBlur('message')}
          className="resize-none"
        />
      </FormField>
    </div>
  );
};

export default ContactFormFields;