// components/about-us/AboutCTA.tsx
"use client";

import { motion } from "framer-motion";

const AboutCTA = () => {
  return (
    <div className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-linear-to-r from-[#1a4494] to-[#f28224] text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-shadow text-lg"
          >
            Start Free Trial
          </motion.button>
          <p className="text-[#676879] text-sm mt-4">
            No credit card required • 14-day free trial • All features included
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutCTA;