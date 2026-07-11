'use client';

import { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff, Building } from 'lucide-react';
import SocialAuth from './SocialAuth';
import AuthDivider from './AuthDivider';
import { useAuthStore } from '@/lib/authStore';
import { useForm } from '@/lib/hooks/useForm';
import { validators } from '@/lib/utils/validation';
import FormField from '@/components/Form/FormField';

interface SignupFormProps {
  onSubmit: (data: any) => void;
  isLoading: boolean;
}

const SignupForm = ({ onSubmit, isLoading }: SignupFormProps) => {
  const { error: serverError } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  const { values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting } = useForm({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      company: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
      newsletter: true
    },
    validationSchema: {
      firstName: [validators.required, validators.minLength(2)],
      lastName: [validators.required, validators.minLength(2)],
      email: [validators.required, validators.email],
      password: [validators.required, validators.password],
      confirmPassword: [
        validators.required,
        validators.matches('password', "Les mots de passe ne correspondent pas")
      ],
      acceptTerms: [validators.required]
    },
    onSubmit: (data) => onSubmit(data)
  });

  return (
    <div className="space-y-6">
      <AuthDivider />

      {/* Global Error */}
      {serverError && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm animate-shake">
          {serverError}
        </div>
      )}

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nom et Prénom */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="Prénom"
            name="firstName"
            error={errors.firstName}
            touched={touched.firstName}
            icon={User}
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
            icon={User}
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
          label="Adresse email professionnelle"
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

        {/* Company */}
        <FormField
          label="Entreprise"
          name="company"
          error={errors.company}
          touched={touched.company}
          icon={Building}
        >
          <input
            type="text"
            placeholder="Nom de votre entreprise (optionnel)"
            value={values.company}
            onChange={(e) => handleChange('company', e.target.value)}
            onBlur={() => handleBlur('company')}
          />
        </FormField>

        {/* Password */}
        <div className="relative">
          <FormField
            label="Mot de passe"
            name="password"
            error={errors.password}
            touched={touched.password}
            icon={Lock}
            required
          >
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Minimum 8 caractères"
              value={values.password}
              onChange={(e) => handleChange('password', e.target.value)}
              onBlur={() => handleBlur('password')}
            />
          </FormField>
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-[34px] p-2 text-gray-400 hover:text-gray-600 transition-colors z-10"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* Confirm Password */}
        <FormField
          label="Confirmer le mot de passe"
          name="confirmPassword"
          error={errors.confirmPassword}
          touched={touched.confirmPassword}
          icon={Lock}
          required
        >
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Retapez votre mot de passe"
            value={values.confirmPassword}
            onChange={(e) => handleChange('confirmPassword', e.target.value)}
            onBlur={() => handleBlur('confirmPassword')}
          />
        </FormField>

        {/* Checkboxes */}
        <div className="space-y-3 pt-2">
          <div className="flex flex-col gap-1">
            <div className="flex items-start">
              <input
                type="checkbox"
                id="acceptTerms"
                checked={values.acceptTerms}
                onChange={(e) => handleChange('acceptTerms', e.target.checked)}
                onBlur={() => handleBlur('acceptTerms')}
                className={`h-4 w-4 text-[#1a4494] focus:ring-[#1a4494] border-gray-300 rounded mt-1 transition-all ${touched.acceptTerms && errors.acceptTerms ? 'border-red-500 ring-1 ring-red-500' : values.acceptTerms ? 'border-emerald-500 ring-1 ring-emerald-500' : ''}`}
              />
              <label htmlFor="acceptTerms" className="ml-2 text-sm text-gray-700">
                J&apos;accepte les{' '}
                <a href="/terms" className="text-[#1a4494] hover:underline">Conditions d&apos;utilisation</a>{' '}
                et la{' '}
                <a href="/privacy" className="text-[#1a4494] hover:underline">Politique de confidentialité</a>
              </label>
            </div>
            {touched.acceptTerms && errors.acceptTerms && (
              <p className="text-red-500 text-[10px] font-medium ml-6 animate-in fade-in slide-in-from-top-1">
                {errors.acceptTerms}
              </p>
            )}
          </div>

          <div className="flex items-start">
            <input
              type="checkbox"
              id="newsletter"
              checked={values.newsletter}
              onChange={(e) => handleChange('newsletter', e.target.checked)}
              className="h-4 w-4 text-[#1a4494] focus:ring-[#1a4494] border-gray-300 rounded mt-1"
            />
            <label htmlFor="newsletter" className="ml-2 text-sm text-gray-700">
              Je souhaite recevoir des conseils, astuces et offres par email
            </label>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading || isSubmitting}
          className="w-full py-3 bg-gradient-to-r from-[#1a4494] to-[#f28224] text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transform hover:-translate-y-0.5 active:translate-y-0"
        >
          {isLoading || isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Création du compte...
            </>
          ) : (
            'Créer mon compte gratuitement'
          )}
        </button>
      </form>

      {/* Offer note */}
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-100 transition-all hover:bg-blue-100">
        <p className="text-sm text-gray-700">
          <span className="font-semibold text-blue-800">14 jours gratuits</span> - 
          Testez toutes les fonctionnalités premium sans engagement
        </p>
      </div>
    </div>
  );
};

export default SignupForm;
SignupForm;