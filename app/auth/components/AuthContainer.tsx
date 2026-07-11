'use client';

import { useState } from 'react';
import AuthHeader from './AuthHeader';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';

import { useRouter } from 'next/navigation';
import useAuthStore from '@/lib/authStore';

const AuthContainer = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { login, register, isLoading } = useAuthStore();
  const router = useRouter();

  const handleAuthSuccess = () => {
    // Redirection after successful auth
    const currentUser = useAuthStore.getState().user;
    if (currentUser?.role === 'ADMIN') {
      router.push('/admin/');
    } else if (currentUser?.role === 'REP') {
      router.push('/rep/');
    } else {
      router.push('/');
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      if (isLogin) {
        await login(data.email, data.password);
        handleAuthSuccess();
      } else {
        // Map frontend fields (firstName, lastName, email, password, company) to backend DTO fields
        const userData = {
          name: `${data.firstName} ${data.lastName}`,
          email: data.email,
          password: data.password,
          company: data.company,
          role: 'ADMIN' // Manager -> Admin
        };
        await register(userData);
        setIsLogin(true);
      }
    } catch (error) {
      // Error is handled in the store, we could show a toast here too
      console.error('Authentication error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          {/* Header */}
          <AuthHeader
            isLogin={isLogin}
            onToggle={() => setIsLogin(!isLogin)}
          />

          {/* Form */}
          <div className="p-8">
            {isLogin ? (
              <LoginForm
                onSubmit={handleSubmit}
                isLoading={isLoading}
              />
            ) : (
              <SignupForm
                onSubmit={handleSubmit}
                isLoading={isLoading}
              />
            )}
          </div>

          {/* Footer */}
          <div className="px-8 pb-8">
            <div className="text-center text-sm text-gray-500">
              {isLogin ? (
                <p>
                  Pas encore de compte ?{' '}
                  <button
                    onClick={() => setIsLogin(false)}
                    className="text-[#1a4494] hover:text-[#f28224] font-medium"
                  >
                    Créer un compte
                  </button>
                </p>
              ) : (
                <p>
                  Déjà un compte ?{' '}
                  <button
                    onClick={() => setIsLogin(true)}
                    className="text-[#1a4494] hover:text-[#f28224] font-medium"
                  >
                    Se connecter
                  </button>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Informations légales */}
        <div className="mt-8 text-center text-xs text-gray-500">
          <p>
            En continuant, vous acceptez nos{' '}
            <a href="/terms" className="text-[#1a4494] hover:underline">Conditions d&apos;utilisation</a>{' '}
            et notre{' '}
            <a href="/privacy" className="text-[#1a4494] hover:underline">Politique de confidentialité</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthContainer;