'use client';

import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import SocialAuth from './SocialAuth';
import AuthDivider from './AuthDivider';
import { useAuthStore } from '@/lib/authStore';
import { useForm } from '@/lib/hooks/useForm';
import { validators } from '@/lib/utils/validation';
import FormField from '@/components/Form/FormField';

interface LoginFormProps {
  onSubmit: (data: any) => void;
  isLoading: boolean;
}

const LoginForm = ({ onSubmit, isLoading }: LoginFormProps) => {
  const { error: serverError } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  const { values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting } = useForm({
    initialValues: {
      email: '',
      password: '',
      rememberMe: false
    },
    validationSchema: {
      email: [validators.required, validators.email],
      password: [validators.required, validators.minLength(6)]
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
        {/* Email */}
        <FormField
          label="Adresse email"
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
              placeholder="••••••••"
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

        {/* Remember me */}
        <div className="flex items-center pt-2">
          <input
            type="checkbox"
            id="rememberMe"
            checked={values.rememberMe}
            onChange={(e) => handleChange('rememberMe', e.target.checked)}
            className="h-4 w-4 text-[#FF375E] focus:ring-[#FF375E] border-gray-300 rounded transition-all cursor-pointer"
          />
          <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-700 cursor-pointer select-none">
            Se souvenir de moi
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading || isSubmitting}
          className="w-full py-3 bg-gradient-to-r from-[#FF375E] to-[#FF5E5E] text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transform hover:-translate-y-0.5 active:translate-y-0"
        >
          {isLoading || isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Connexion en cours...
            </>
          ) : (
            'Se connecter'
          )}
        </button>
      </form>

      {/* Security note */}
      <div className="text-center pt-2">
        <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider flex items-center justify-center gap-1.5">
          <svg className="w-3.5 h-3.5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Connexion sécurisée SSL 256-bit
        </p>
      </div>
    </div>
  );
};

export default LoginForm;