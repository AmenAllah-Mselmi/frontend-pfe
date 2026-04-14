import { CheckCircle } from 'lucide-react';

interface BenefitListProps {
  benefits: string[];
}

const BenefitList = ({ benefits }: BenefitListProps) => {
  return (
    <div className="mb-10">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">
        Pourquoi nous contacter ?
      </h3>
      <div className="space-y-4">
        {benefits.map((benefit, index) => (
          <div key={index} className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
              <CheckCircle className="w-4 h-4 text-green-600" />
            </div>
            <p className="text-gray-700">{benefit}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BenefitList;