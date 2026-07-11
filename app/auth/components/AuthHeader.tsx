import Image from 'next/image';

interface AuthHeaderProps {
  isLogin: boolean;
  onToggle: () => void;
}

const AuthHeader = ({ isLogin, onToggle }: AuthHeaderProps) => {
  return (
    <div className="relative">
      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={onToggle}
          className={`flex-1 py-4 text-center font-medium transition-colors ${
            isLogin 
              ? 'text-[#1a4494] border-b-2 border-[#1a4494]' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Connexion
        </button>
        <button
          onClick={onToggle}
          className={`flex-1 py-4 text-center font-medium transition-colors ${
            !isLogin 
              ? 'text-[#1a4494] border-b-2 border-[#1a4494]' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Inscription
        </button>
      </div>

      {/* Logo et titre */}
      <div className="p-8 pb-0 text-center">
        <div className="flex justify-center mb-6">
          <Image src="/logo.png" alt="CRM Micro SaaS Logo" width={180} height={50} className="object-contain" priority />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {isLogin ? 'Bienvenue sur CRM MICRO SAAS' : 'Commencez gratuitement'}
        </h1>
        <p className="text-gray-600">
          {isLogin 
            ? 'Connectez-vous pour accéder à votre espace' 
            : 'Créez votre compte et transformez votre façon de travailler'}
        </p>
      </div>
    </div>
  );
};

export default AuthHeader;