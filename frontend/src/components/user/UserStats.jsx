import React from "react";
import { BookOpen, FileText, Calendar, Clock } from "lucide-react";
import { SlideUp } from "../ui/animations/index";
import { useUserData } from "../../contexts/UserDataContext";

const UserStats = () => {
  const { stats, loading } = useUserData();

  const statItems = [
    {
      label: "Livres lus",
      value: stats?.booksRead || 0,
      icon: BookOpen,
      color: "bg-blue-500",
    },
    {
      label: "Publications",
      value: stats?.publicationsCount || 0,
      icon: FileText,
      color: "bg-green-500",
    },
    {
      label: "Événements",
      value: stats?.eventsAttended || 0,
      icon: Calendar,
      color: "bg-yellow-500",
    },
    {
      label: "Jours restants",
      value: stats?.daysRemaining || 365,
      icon: Clock,
      color: "bg-purple-500",
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow-md p-6 animate-pulse"
          >
            <div className="h-16 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statItems.map((stat, index) => (
        <SlideUp key={stat.label} delay={index * 0.1}>
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stat.value}
                </p>
              </div>
              <div
                className={`${stat.color} w-12 h-12 rounded-xl flex items-center justify-center`}
              >
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </SlideUp>
      ))}
    </div>
  );
};

export default UserStats;
