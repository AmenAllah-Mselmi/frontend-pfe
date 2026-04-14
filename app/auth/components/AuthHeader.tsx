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
              ? 'text-[#FF375E] border-b-2 border-[#FF375E]' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Connexion
        </button>
        <button
          onClick={onToggle}
          className={`flex-1 py-4 text-center font-medium transition-colors ${
            !isLogin 
              ? 'text-[#FF375E] border-b-2 border-[#FF375E]' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Inscription
        </button>
      </div>

      {/* Logo et titre */}
      <div className="p-8 pb-0 text-center">
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 bg-linear-to-r from-[#FF375E] to-[#FF5E5E] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-2xl">m</span>
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {isLogin ? 'Bienvenue sur monday.com' : 'Commencez gratuitement'}
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