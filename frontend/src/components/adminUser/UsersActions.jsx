// frontend/src/pages/admin/users/components/UserActions.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  XCircle,
  Ban,
  Trash2,
  Eye,
  MoreVertical,
  Shield,
  ShieldOff,
  UserCog,
} from "lucide-react";

const UserActions = ({
  user,
  onVerify,
  onReject,
  onToggleBlock,
  onDelete,
  onViewDetails,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleAction = (action) => {
    setIsOpen(false);

    switch (action) {
      case "verify":
        onVerify?.(user.id);
        break;
      case "reject":
        onReject?.(user.id);
        break;
      case "block":
      case "unblock":
        onToggleBlock?.(user.id);
        break;
      case "view":
        onViewDetails?.(user);
        break;
      case "delete":
        // ✅ Utilise le modal global DeleteConfirmModal
        onDelete?.(user.id);
        break;
      default:
        break;
    }
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        {!user.isVerified ? (
          <>
            <button
              onClick={() => handleAction("verify")}
              className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
              title="Vérifier"
            >
              <CheckCircle className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleAction("reject")}
              className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
              title="Rejeter"
            >
              <XCircle className="w-4 h-4" />
            </button>
          </>
        ) : (
          <button
            onClick={() => handleAction(user.isActive ? "block" : "unblock")}
            className={`p-2 rounded-lg transition-colors ${
              user.isActive === 1 || user.isActive === true
                ? "bg-orange-100 text-orange-700 hover:bg-orange-200"
                : "bg-green-100 text-green-700 hover:bg-green-200"
            }`}
            title={user.isActive ? "Bloquer" : "Débloquer"}
          >
            {user.isActive ? (
              <Ban className="w-4 h-4" />
            ) : (
              <UserCog className="w-4 h-4" />
            )}
          </button>
        )}

        <button
          onClick={() => handleAction("view")}
          className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
          title="Voir détails"
        >
          <Eye className="w-4 h-4" />
        </button>

        {/* Menu déroulant */}
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border z-50"
              >
                <div className="py-1">
                  {user.role === "admin" ? (
                    <button
                      onClick={() => handleAction("remove-admin")}
                      className="w-full px-4 py-2 text-left text-sm text-orange-600 hover:bg-orange-50 flex items-center gap-2"
                    >
                      <ShieldOff className="w-4 h-4" />
                      Retirer admin
                    </button>
                  ) : (
                    <button
                      onClick={() => handleAction("make-admin")}
                      className="w-full px-4 py-2 text-left text-sm text-purple-600 hover:bg-purple-50 flex items-center gap-2"
                    >
                      <Shield className="w-4 h-4" />
                      Définir admin
                    </button>
                  )}
                  <button
                    onClick={() => handleAction("delete")}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Supprimer
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default UserActions;
