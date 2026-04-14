'use client';

import { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff, Building } from 'lucide-react';
import toast from 'react-hot-toast';
import SocialAuth from './SocialAuth';
import AuthDivider from './AuthDivider';

interface SignupFormProps {
  onSubmit: (data: any) => void;
  isLoading: boolean;
}

const SignupForm = ({ onSubmit, isLoading }: SignupFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
    newsletter: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      toast.error("Le mot de passe doit contenir au moins 8 caractères avec un chiffre et une majuscule.");
      return;
    }
    if (!formData.acceptTerms) {
      toast.error("Veuillez accepter les conditions d'utilisation");
      return;
    }
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="space-y-6">
      {/* Social Auth */}
      {/* <SocialAuth /> */}

      <AuthDivider />

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nom et Prénom */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prénom
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                name="firstName"
                required
                value={formData.firstName}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF375E]/20 focus:border-[#FF375E] transition-colors"
                placeholder="Votre prénom"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                name="lastName"
                required
                value={formData.lastName}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF375E]/20 focus:border-[#FF375E] transition-colors"
                placeholder="Votre nom"
              />
            </div>
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Adresse email professionnelle
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF375E]/20 focus:border-[#FF375E] transition-colors"
              placeholder="nom@entreprise.com"
            />
          </div>
        </div>

        {/* Company */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Entreprise
          </label>
          <div className="relative">
            <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF375E]/20 focus:border-[#FF375E] transition-colors"
              placeholder="Nom de votre entreprise (optionnel)"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mot de passe
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF375E]/20 focus:border-[#FF375E] transition-colors"
              placeholder="Minimum 8 caractères"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5 text-gray-400" />
              ) : (
                <Eye className="w-5 h-5 text-gray-400" />
              )}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Doit contenir au moins 8 caractères avec un chiffre et une majuscule.
          </p>
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confirmer le mot de passe
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF375E]/20 focus:border-[#FF375E] transition-colors"
              placeholder="Retapez votre mot de passe"
            />
          </div>
        </div>

        {/* Checkboxes */}
        <div className="space-y-3">
          <div className="flex items-start">
            <input
              type="checkbox"
              name="acceptTerms"
              checked={formData.acceptTerms}
              onChange={handleChange}
              className="h-4 w-4 text-[#FF375E] focus:ring-[#FF375E] border-gray-300 rounded mt-1"
            />
            <label className="ml-2 text-sm text-gray-700">
              J&apos;accepte les{' '}
              <a href="/terms" className="text-[#FF375E] hover:underline">Conditions d&apos;utilisation</a>{' '}
              et la{' '}
              <a href="/privacy" className="text-[#FF375E] hover:underline">Politique de confidentialité</a>
            </label>
          </div>
          <div className="flex items-start">
            <input
              type="checkbox"
              name="newsletter"
              checked={formData.newsletter}
              onChange={handleChange}
              className="h-4 w-4 text-[#FF375E] focus:ring-[#FF375E] border-gray-300 rounded mt-1"
            />
            <label className="ml-2 text-sm text-gray-700">
              Je souhaite recevoir des conseils, astuces et offres par email
            </label>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-linear-to-r from-[#FF375E] to-[#FF5E5E] text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? (
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
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
        <p className="text-sm text-gray-700">
          <span className="font-semibold">14 jours gratuits</span> - 
          Testez toutes les fonctionnalités premium sans engagement
        </p>
      </div>
    </div>
  );
};

export default SignupForm;