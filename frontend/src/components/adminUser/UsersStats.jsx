// frontend/src/pages/admin/users/components/UsersStats.jsx
import React from "react";
import { motion } from "framer-motion";
import {
  Users,
  UserCheck,
  UserX,
  Shield,
  AlertCircle,
  Clock,
} from "lucide-react";

const StatCard = ({ title, value, icon: Icon, color, description }) => (
  <motion.div
    whileHover={{ y: -2 }}
    className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-all"
  >
    <div className="flex items-center justify-between mb-2">
      <div className={`p-2 bg-${color}-100 rounded-lg`}>
        <Icon className={`w-6 h-6 text-${color}-600`} />
      </div>
      <span className="text-2xl font-bold text-gray-900">{value}</span>
    </div>
    <p className="text-sm font-medium text-gray-600">{title}</p>
    {description && <p className="text-xs text-gray-400 mt-1">{description}</p>}
  </motion.div>
);

const UsersStats = ({ users }) => {
  const stats = [
    {
      title: "Total utilisateurs",
      value: users.length,
      icon: Users,
      color: "blue",
      description: "Tous les comptes",
    },
    {
      title: "En attente",
      value: users.filter((u) => !u.isVerified).length,
      icon: Clock,
      color: "yellow",
      description: "À vérifier",
    },
    {
      title: "Vérifiés",
      value: users.filter((u) => u.isVerified).length,
      icon: UserCheck,
      color: "green",
      description: "Comptes actifs",
    },
    {
      title: "Bloqués",
      value: users.filter((u) => u.isActive === false).length,
      icon: UserX,
      color: "red",
      description: "Comptes suspendus",
    },
    {
      title: "Administrateurs",
      value: users.filter((u) => u.role === "admin").length,
      icon: Shield,
      color: "purple",
      description: "Accès total",
    },
    {
      title: "Non vérifiés",
      value: users.filter((u) => !u.isVerified && u.isActive !== false).length,
      icon: AlertCircle,
      color: "orange",
      description: "En attente de justificatif",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
};

export default UsersStats;
