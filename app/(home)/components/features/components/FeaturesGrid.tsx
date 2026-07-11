// components/about-us/FeaturesGrid.tsx
"use client";

import { Zap, Shield, Users, BarChart, Cloud, CheckCircle } from "lucide-react";
import FeatureCard from "./FeatureCard";

const FeaturesGrid = () => {
  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Lightning Fast",
      description: "Real-time updates and instant collaboration for your team",
      color: "#1a4494"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Enterprise Security",
      description: "Bank-level security with end-to-end encryption",
      color: "#579bfc"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Team Collaboration",
      description: "Work together seamlessly across departments",
      color: "#00c875"
    },
    {
      icon: <BarChart className="w-6 h-6" />,
      title: "Advanced Analytics",
      description: "Data-driven insights to improve productivity",
      color: "#ff9a3d"
    },
    {
      icon: <Cloud className="w-6 h-6" />,
      title: "Cloud Native",
      description: "Access your work from anywhere, on any device",
      color: "#a25ddc"
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: "99.9% Uptime",
      description: "Reliable service you can count on",
      color: "#0085ff"
    }
  ];

  return (
    <div className="py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-[#323338] text-center mb-12">
          Why Choose <span className="text-[#1a4494]">Our Platform</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              color={feature.color}
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturesGrid;