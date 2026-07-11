import Image from 'next/image';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Logo */}
          <div className="flex items-center mb-4 md:mb-0">
            <Image src="/logo.png" alt="CRM Micro SaaS Logo" width={100} height={30} className="object-contain" />
          </div>

          {/* Liens */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-sm text-gray-600 mb-4 md:mb-0">
            <a href="/features" className="hover:text-[#1a4494]">Fonctionnalités</a>
            <a href="/templates" className="hover:text-[#1a4494]">Templates</a>
            <a href="/pricing" className="hover:text-[#1a4494]">Tarifs</a>
            <a href="/contact" className="hover:text-[#1a4494]">Contact</a>
            <a href="/blog" className="hover:text-[#1a4494]">Blog</a>
            <a href="/help" className="hover:text-[#1a4494]">Aide</a>
          </div>

          {/* Copyright */}
          <div className="text-xs text-gray-500">
            © {currentYear} CRM MICRO SAAS
          </div>
        </div>

        {/* Ligne supplémentaire */}
        <div className="mt-6 pt-6 border-t border-gray-100 text-center text-xs text-gray-500">
          <a href="/privacy" className="hover:text-gray-700 mr-4">Confidentialité</a>
          <a href="/terms" className="hover:text-gray-700 mr-4">Conditions</a>
          <a href="/cookies" className="hover:text-gray-700">Cookies</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;