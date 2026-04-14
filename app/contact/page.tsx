'use client';

import { useState } from 'react';
import { Send, Phone, Mail } from 'lucide-react';
import ContactInfo from './components/ContactInfo';
import ContactFormFields from './components/ContactFormFields';
import FormSuccess from './components/FormSuccess';
import AnimatedHomeButton from './components/common/AnimatedHomeButton';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    jobTitle: '',
    phone: '',
    company: '',
    companySize: '',
    interest: '',
    message: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleInterestSelect = (interest: string) => {
    setFormData(prev => ({ ...prev, interest }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      jobTitle: '',
      phone: '',
      company: '',
      companySize: '',
      interest: '',
      message: ''
    });
    setIsSubmitted(false);
  };

  return (
    <section className="py-20 bg-linear-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Bouton de retour en haut à gauche */}
        <div className="mb-8">
          <AnimatedHomeButton />
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Colonne gauche - Informations */}
          <ContactInfo />

          {/* Colonne droite - Formulaire */}
          <div>
            <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Contactez notre service commercial
                </h2>
                <p className="text-gray-600">
                  Remplissez le formulaire et un expert vous contactera sous 24h.
                </p>
              </div>

              {isSubmitted ? (
                <FormSuccess onReset={resetForm} />
              ) : (
                <form onSubmit={handleSubmit}>
                  <ContactFormFields
                    formData={formData}
                    onChange={handleChange}
                    onInterestSelect={handleInterestSelect}
                  />

                  {/* Bouton d'envoi */}
                  <button
                    type="submit"
                    className="w-full mt-6 py-4 bg-linear-to-r from-[#FF375E] to-[#FF5E5E] text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center"
                  >
                    <Send className="w-5 h-5 mr-2" />
                    Envoyer votre demande
                  </button>

                  {/* Note de confidentialité */}
                  <p className="text-xs text-gray-500 text-center mt-4">
                    En soumettant ce formulaire, vous acceptez notre{' '}
                    <a href="/privacy" className="text-[#FF375E] hover:underline">
                      politique de confidentialité
                    </a>
                    . Vos données seront utilisées uniquement pour répondre à votre demande.
                  </p>
                </form>
              )}
            </div>

            {/* Informations de contact alternatives */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <a
                href="tel:+21612345678"
                className="flex items-center justify-center p-4 border border-gray-300 rounded-xl hover:border-[#FF375E] hover:bg-[#FF375E]/5 transition-colors group"
              >
                <Phone className="w-5 h-5 text-gray-500 group-hover:text-[#FF375E] mr-3" />
                <span className="font-medium text-gray-700 group-hover:text-[#FF375E]">
                  Appelez-nous
                </span>
              </a>
              <a
                href="mailto:commercial@monday.com"
                className="flex items-center justify-center p-4 border border-gray-300 rounded-xl hover:border-[#FF375E] hover:bg-[#FF375E]/5 transition-colors group"
              >
                <Mail className="w-5 h-5 text-gray-500 group-hover:text-[#FF375E] mr-3" />
                <span className="font-medium text-gray-700 group-hover:text-[#FF375E]">
                  Écrivez-nous
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;