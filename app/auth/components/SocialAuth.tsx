import { FcGoogle } from 'react-icons/fc';
import { FaMicrosoft } from 'react-icons/fa';
import { SiSlack } from 'react-icons/si';

const SocialAuth = () => {
  const handleSocialLogin = (provider: string) => {
    console.log(`Login with ${provider}`);
    // Implémenter l'authentification sociale
  };

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => handleSocialLogin('google')}
        className="w-full flex items-center justify-center py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <FcGoogle className="w-5 h-5 mr-3" />
        <span className="font-medium text-gray-700">Continuer avec Google</span>
      </button>

      <button
        type="button"
        onClick={() => handleSocialLogin('microsoft')}
        className="w-full flex items-center justify-center py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <FaMicrosoft className="w-5 h-5 mr-3 text-blue-600" />
        <span className="font-medium text-gray-700">Continuer avec Microsoft</span>
      </button>

      <button
        type="button"
        onClick={() => handleSocialLogin('slack')}
        className="w-full flex items-center justify-center py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <SiSlack className="w-5 h-5 mr-3 text-blue-600" />
        <span className="font-medium text-gray-700">Continuer avec Slack</span>
      </button>
    </div>
  );
};

export default SocialAuth;