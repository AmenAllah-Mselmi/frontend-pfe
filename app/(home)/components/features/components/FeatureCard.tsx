// components/about-us/FeatureCard.tsx
"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  color: string;
  index: number;
}

const FeatureCard = ({ icon, title, description, color, index }: FeatureCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * index }}
      whileHover={{ 
        y: -8,
        boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
      }}
      className="group bg-white rounded-xl border border-[#e6e9ef] p-6 shadow-sm hover:shadow-xl transition-all duration-300"
    >
      <div className="flex items-start gap-4">
        <div 
          className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform"
          style={{ 
            background: `linear-linear(135deg, ${color}80, ${color})`
          }}
        >
          <div className="text-white">
            {icon}
          </div>
        </div>
        <div>
          <h3 className="text-xl font-bold text-[#323338] mb-2">{title}</h3>
          <p className="text-[#676879]">{description}</p>
        </div>
      </div>
      
      <motion.div 
        initial={{ width: 0 }}
        whileInView={{ width: "100%" }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="h-1 bg-linear-to-r from-transparent via-transparent to-transparent group-hover:from-transparent group-hover:via-current group-hover:to-transparent mt-4"
      />
    </motion.div>
  );
};

export default FeatureCard;