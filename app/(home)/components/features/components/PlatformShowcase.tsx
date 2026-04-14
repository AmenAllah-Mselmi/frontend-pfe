// components/about-us/PlatformShowcase.tsx
"use client";

import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

const PlatformShowcase = () => {
  return (
    <div className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="bg-linear-to-r from-[#FF375E] to-[#FF5E5E] rounded-2xl p-8 md:p-12 text-white"
        >
          <div className="max-w-3xl mx-auto text-center">
            <div className="text-5xl mb-6">✨</div>
            <h2 className="text-3xl font-bold mb-4">All Features Included</h2>
            <p className="text-white/90 text-lg mb-8">
              No hidden costs, no premium tiers. Get access to all features with one simple plan.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {["Unlimited Projects", "Advanced Analytics", "Priority Support"].map((item, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20"
                >
                  <CheckCircle className="w-5 h-5 inline mr-2" />
                  {item}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PlatformShowcase;