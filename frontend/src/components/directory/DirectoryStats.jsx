// components/directory/DirectoryStats.jsx
import React from "react";
import { MapPin, BookOpen } from "lucide-react";

const StatsSection = ({ title, icon: Icon, data, total, color = "green" }) => {
  const gradientColor =
    color === "green"
      ? "from-asm-green-500 to-asm-green-600"
      : "from-asm-yellow-500 to-asm-yellow-600";

  return (
    <div>
      <h4 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
        <Icon className={`w-5 h-5 mr-3 text-asm-${color}-600`} />
        {title}
      </h4>
      <div className="space-y-4">
        {Object.entries(data || {}).map(([key, value]) => (
          <div key={key} className="flex items-center">
            <div className="w-40 text-gray-700">{key}</div>
            <div className="flex-1">
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${gradientColor} rounded-full`}
                  style={{ width: `${(value / total) * 100}%` }}
                />
              </div>
            </div>
            <div className="w-12 text-right font-medium text-gray-900">
              {value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const DirectoryStats = ({ stats }) => {
  if (!stats) return null;

  return (
    <div className="bg-gradient-to-br from-asm-green-50 to-asm-yellow-50 rounded-3xl p-8 border border-asm-green-200">
      <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
        Répartition des membres
      </h3>

      <div className="grid md:grid-cols-2 gap-8">
        <StatsSection
          title="Par région"
          icon={MapPin}
          data={stats.byRegion}
          total={stats.total}
          color="green"
        />
        <StatsSection
          title="Par domaine"
          icon={BookOpen}
          data={stats.byExpertise}
          total={stats.total}
          color="yellow"
        />
      </div>
    </div>
  );
};

export default DirectoryStats;
