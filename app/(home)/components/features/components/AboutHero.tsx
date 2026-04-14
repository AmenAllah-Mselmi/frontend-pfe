// components/about-us/AboutHero.tsx
"use client";

import { motion } from "framer-motion";

const AboutHero = () => {
  const stats = [
    { number: "10K+", label: "Active Teams", color: "#FF375E" },
    { number: "99.9%", label: "Uptime", color: "#00c875" },
    { number: "500+", label: "Integrations", color: "#579bfc" },
    { number: "24/7", label: "Support", color: "#a25ddc" }
  ];

  return (
    <div className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-20 h-20 bg-linear-to-br from-[#FF375E] to-[#FF5E5E] rounded-xl flex items-center justify-center mx-auto mb-6 shadow-lg"
          >
            <span className="text-white text-3xl font-bold">★</span>
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#323338] mb-4">
            Built for <span className="text-[#FF375E]">Modern Teams</span>
          </h1>
          <p className="text-[#676879] text-lg max-w-2xl mx-auto">
            Discover the powerful features that make our platform the choice for thousands of teams worldwide
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-xl border border-[#e6e9ef] p-6 text-center shadow-sm hover:shadow-md transition-all"
            >
              <div 
                className="text-3xl font-bold mb-2"
                style={{ color: stat.color }}
              >
                {stat.number}
              </div>
              <div className="text-[#676879]">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default AboutHero;