'use client';

import { useState } from 'react';
import { Send, Phone, Mail } from 'lucide-react';
import { useForm } from '@/lib/hooks/useForm';
import { validators } from '@/lib/utils/validation';
import ContactInfo from './components/ContactInfo';
import ContactFormFields from './components/ContactFormFields';
import FormSuccess from './components/FormSuccess';
import AnimatedHomeButton from './components/common/AnimatedHomeButton';

const ContactForm = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      jobTitle: '',
      phone: '',
      company: '',
      companySize: '',
      interest: '',
      message: ''
    },
    validationSchema: {
      firstName: [validators.required, validators.minLength(2)],
      lastName: [validators.required, validators.minLength(2)],
      email: [validators.required, validators.email],
      company: [validators.required, validators.minLength(2)],
      companySize: [validators.required],
      interest: [validators.required]
    },
    onSubmit: (data) => {
      console.log('Form submitted:', data);
      setIsSubmitted(true);
      // Simulate real submission
      setTimeout(() => {
        // We don't reset automatically in the original code, but we show success
      }, 1000);
    }
  });

  const handleInterestSelect = (interest: string) => {
    form.handleChange('interest', interest);
  };

  const resetForm = () => {
    form.resetForm();
    setIsSubmitted(false);
  };

  return (
    <section className="py-20 bg-linear-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <AnimatedHomeButton />
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          <ContactInfo />

          <div>
            <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl p-8 sm:p-10 relative overflow-hidden">
              {/* Decorative accent */}
              <div className="absolute top-0 left-0 w-2 h-full bg-linear-to-b from-[#1a4494] to-[#f28224]" />
              
              <div className="mb-10">
                <h2 className="text-3xl font-extrabold text-gray-900 mb-3 tracking-tight">
                  Contactez notre service commercial
                </h2>
                <div className="flex items-center gap-2 text-gray-500">
                  <div className="w-8 h-px bg-gray-200" />
                  <p className="text-sm font-medium">
                    Remplissez le formulaire et un expert vous contactera sous 24h.
                  </p>
                </div>
              </div>

              {isSubmitted ? (
                <FormSuccess onReset={resetForm} />
              ) : (
                <form onSubmit={form.handleSubmit} className="space-y-2">
                  <ContactFormFields
                    form={form}
                    onInterestSelect={handleInterestSelect}
                  />

                  <button
                    type="submit"
                    disabled={form.isSubmitting}
                    className="w-full mt-8 py-4 bg-linear-to-r from-[#1a4494] to-[#f28224] text-white font-bold rounded-xl hover:shadow-xl hover:shadow-[#1a4494]/20 transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center disabled:opacity-50 disabled:transform-none select-none"
                  >
                    {form.isSubmitting ? (
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    ) : (
                      <Send className="w-5 h-5 mr-2" />
                    )}
                    Envoyer votre demande
                  </button>

                  <p className="text-[10px] text-gray-400 text-center mt-6 leading-relaxed">
                    En soumettant ce formulaire, vous acceptez notre{' '}
                    <a href="/privacy" className="text-[#1a4494] hover:underline font-semibold transition-all">
                      politique de confidentialité
                    </a>
                    . Vos données seront traitées avec le plus grand soin.
                  </p>
                </form>
              )}
            </div>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <a
                href="tel:+21612345678"
                className="flex items-center justify-center p-5 bg-white border border-gray-100 rounded-2xl hover:border-[#1a4494] hover:shadow-md transition-all group"
              >
                <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center mr-4 group-hover:bg-[#1a4494]/5 transition-colors">
                  <Phone className="w-5 h-5 text-gray-400 group-hover:text-[#1a4494] transition-colors" />
                </div>
                <span className="font-semibold text-gray-700 group-hover:text-[#1a4494] transition-colors">
                  Appelez-nous
                </span>
              </a>
              <a
                href="mailto:commercial@crmmicrosaas.com"
                className="flex items-center justify-center p-5 bg-white border border-gray-100 rounded-2xl hover:border-[#1a4494] hover:shadow-md transition-all group"
              >
                <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center mr-4 group-hover:bg-[#1a4494]/5 transition-colors">
                  <Mail className="w-5 h-5 text-gray-400 group-hover:text-[#1a4494] transition-colors" />
                </div>
                <span className="font-semibold text-gray-700 group-hover:text-[#1a4494] transition-colors">
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