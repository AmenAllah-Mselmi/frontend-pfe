interface TestimonialCardProps {
  quote: string;
  author: string;
  position: string;
  company: string;
  initials: string;
}

const TestimonialCard = ({ 
  quote, 
  author, 
  position, 
  company, 
  initials 
}: TestimonialCardProps) => {
  return (
    <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border border-gray-200 shadow-sm">
      <div className="flex items-start mb-6">
        <div className="text-3xl text-gray-300 mr-3">&quot;</div>
        <blockquote className="text-lg text-gray-700 italic leading-relaxed">
          {quote}
        </blockquote>
      </div>
      <div className="flex items-center">
        <div className="w-12 h-12 bg-gradient-to-r from-[#1a4494] to-[#f28224] rounded-full flex items-center justify-center text-white font-bold">
          {initials}
        </div>
        <div className="ml-4">
          <div className="font-bold text-gray-900">{author}</div>
          <div className="text-sm text-gray-600">
            {position} | {company}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;