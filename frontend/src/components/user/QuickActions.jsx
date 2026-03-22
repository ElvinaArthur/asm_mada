import React from "react";
import { Library, User, FileText, Settings } from "lucide-react";
import { HoverEffect, SlideUp } from "../ui/animations/index";

const QuickActions = () => {
  const actions = [
    {
      label: "Bibliothèque",
      icon: Library,
      path: "/library",
      color: "from-blue-500 to-blue-600",
    },
    {
      label: "Mon profil",
      icon: User,
      path: "/profile",
      color: "from-green-500 to-green-600",
    },
    {
      label: "Documents",
      icon: FileText,
      path: "/documents",
      color: "from-yellow-500 to-yellow-600",
    },
    {
      label: "Paramètres",
      icon: Settings,
      path: "/settings",
      color: "from-gray-500 to-gray-600",
    },
  ];

  return (
    <SlideUp>
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Accès rapide</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {actions.map((action, index) => (
            <HoverEffect key={action.label}>
              <a
                href={action.path}
                className={`bg-gradient-to-br ${action.color} rounded-xl p-5 text-white text-center hover:shadow-xl transition-all`}
              >
                <action.icon className="w-8 h-8 mx-auto mb-3" />
                <span className="font-medium">{action.label}</span>
              </a>
            </HoverEffect>
          ))}
        </div>
      </div>
    </SlideUp>
  );
};

export default QuickActions;
