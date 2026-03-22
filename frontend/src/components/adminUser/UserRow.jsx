// frontend/src/pages/admin/users/components/UserRow.jsx
import React from "react";
import { motion } from "framer-motion";
import { Mail, Calendar, Shield, User, Ban } from "lucide-react";
import UserActions from "./UsersActions";

const UserRow = ({
  user,
  isSelected,
  onSelect,
  onVerify,
  onReject,
  onToggleBlock,
  onDelete,
  onViewDetails,
}) => {
  const getInitials = () => {
    return `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase();
  };

  const getStatusBadge = () => {
    // 🔴 CORRECTION ICI : isActive est maintenant dans la base
    const isActive = user.isActive === 1 || user.isActive === true;

    if (!isActive) {
      return { label: "Bloqué", color: "bg-red-100 text-red-800" };
    }
    if (user.isVerified) {
      return { label: "Vérifié", color: "bg-green-100 text-green-800" };
    }
    return { label: "En attente", color: "bg-yellow-100 text-yellow-800" };
  };

  const status = getStatusBadge();

  return (
    <motion.tr
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`border-b hover:bg-gray-50 transition-colors ${
        !user.isActive ? "bg-red-50/30" : ""
      }`}
    >
      <td className="px-6 py-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => onSelect(user.id, e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div
            className={`h-10 w-10 flex-shrink-0 rounded-full flex items-center justify-center ${
              user.role === "admin"
                ? "bg-purple-100"
                : user.isActive
                  ? "bg-blue-100"
                  : "bg-gray-200"
            }`}
          >
            <span
              className={`font-medium ${
                user.role === "admin"
                  ? "text-purple-700"
                  : user.isActive
                    ? "text-blue-700"
                    : "text-gray-600"
              }`}
            >
              {getInitials()}
            </span>
          </div>
          <div className="ml-4">
            <div className="font-medium text-gray-900 flex items-center gap-2">
              {user.firstName} {user.lastName}
              {user.role === "admin" && (
                <span className="px-2 py-0.5 bg-purple-100 text-purple-800 rounded-full text-xs font-medium flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  Admin
                </span>
              )}
              {!user.isActive && (
                <span className="px-2 py-0.5 bg-red-100 text-red-800 rounded-full text-xs font-medium flex items-center gap-1">
                  <Ban className="w-3 h-3" />
                  Bloqué
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Mail className="w-3 h-3 text-gray-400" />
              <span className="text-gray-600">{user.email}</span>
            </div>
          </div>
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${status.color}`}
        >
          {status.label}
        </span>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-1 text-sm text-gray-600">
          <Calendar className="w-4 h-4 text-gray-400" />
          {new Date(user.createdAt).toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-600">
          {user.graduationYear || "—"}
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-600 max-w-[150px] truncate">
          {user.specialization || "—"}
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <UserActions
          user={user}
          onVerify={onVerify}
          onReject={onReject}
          onToggleBlock={onToggleBlock}
          onDelete={onDelete}
          onViewDetails={onViewDetails}
        />
      </td>
    </motion.tr>
  );
};

export default UserRow;
