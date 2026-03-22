import React from "react";
import { motion } from "framer-motion";
import { Users, Clock, FileText, Shield } from "lucide-react";

const StatCard = ({ title, value, icon: Icon, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow"
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
      <Icon className={`w-8 h-8 text-${color}-500`} />
    </div>
  </motion.div>
);

const StatsCards = ({ stats, pendingUsers }) => {
  const cards = [
    {
      title: "Total en attente",
      value: stats.totalPending || 0,
      icon: Clock,
      color: "yellow",
    },
    {
      title: "Avec justificatif",
      value: pendingUsers.filter((u) => u.hasProof).length,
      icon: FileText,
      color: "blue",
    },
    {
      title: "7 derniers jours",
      value: stats.lastWeek || 0,
      icon: Users,
      color: "green",
    },
    {
      title: "Temps moyen",
      value: stats.averageTime || "2.5 jours",
      icon: Shield,
      color: "purple",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      {cards.map((card, index) => (
        <StatCard key={index} {...card} />
      ))}
    </div>
  );
};

export default StatsCards;
