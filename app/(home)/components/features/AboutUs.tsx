// components/about-us/index.tsx
import AboutHero from './components/AboutHero';
import FeaturesGrid from './components/FeaturesGrid';
import PlatformShowcase from './components/PlatformShowcase';
import Integrations from './components/Integrations';
import AboutCTA from './components/AboutCTA';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-[#fafafa]">
      <AboutHero />
      <FeaturesGrid />
      <PlatformShowcase />
      <Integrations />
      <AboutCTA />
    </div>
  );
};

export default AboutUs;