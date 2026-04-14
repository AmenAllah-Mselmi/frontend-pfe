// components/about-us/Integrations.tsx
"use client";

import { motion } from "framer-motion";

const Integrations = () => {
  const integrations = ["Slack", "Google Drive", "Notion", "Figma", "GitHub", "Zoom"];

  return (
    <div className="py-16 px-4 bg-[#fafafa]">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-[#323338] text-center mb-8">
          Seamless <span className="text-[#FF375E]">Integrations</span>
        </h2>
        
        <div className="flex flex-wrap justify-center gap-4">
          {integrations.map((tool, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white px-6 py-3 rounded-lg border border-[#e6e9ef] shadow-sm hover:shadow-md transition-all"
            >
              <span className="font-medium text-[#323338]">{tool}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Integrations;