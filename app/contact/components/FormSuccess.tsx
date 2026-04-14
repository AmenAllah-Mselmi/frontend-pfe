import { CheckCircle } from 'lucide-react';

interface FormSuccessProps {
  onReset: () => void;
}

const FormSuccess = ({ onReset }: FormSuccessProps) => {
  return (
    <div className="text-center py-12">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="w-10 h-10 text-green-600" />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-3">
        Message envoyé avec succès !
      </h3>
      <p className="text-gray-600 mb-8">
        Un expert commercial vous contactera très prochainement.
      </p>
      <button
        onClick={onReset}
        className="px-6 py-3 border-2 border-[#FF375E] text-[#FF375E] font-medium rounded-lg hover:bg-[#FF375E] hover:text-white transition-colors"
      >
        Envoyer un nouveau message
      </button>
    </div>
  );
};

export default FormSuccess;