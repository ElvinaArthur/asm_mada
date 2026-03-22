import React from "react";
import { motion } from "framer-motion";

const IconButton = ({
  children,
  onClick,
  className = "",
  disabled = false,
  variant = "primary",
  icon: Icon,
  ...props
}) => {
  const variantClasses = {
    primary: "bg-asm-green-600 hover:bg-asm-green-700 text-white",
    secondary: "bg-asm-yellow-600 hover:bg-asm-yellow-700 text-white",
    outline:
      "border border-gray-300 hover:border-gray-400 text-gray-700 hover:bg-gray-50",
    ghost: "text-gray-600 hover:text-gray-900 hover:bg-gray-100",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      disabled={disabled}
      className={`
        p-2 rounded-lg transition-colors
        ${variantClasses[variant]}
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      {...props}
    >
      {Icon ? <Icon className="w-5 h-5" /> : children}
    </motion.button>
  );
};

export default IconButton;
