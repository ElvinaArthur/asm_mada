import React from "react";

const PrimaryButton = ({
  children,
  onClick,
  className = "",
  disabled = false,
  ...props
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        bg-gradient-to-r from-asm-green-600 to-asm-green-700
        hover:from-asm-green-700 hover:to-asm-green-800
        text-white font-semibold py-3 px-6 rounded-lg
        transition-all duration-300 transform hover:scale-105
        focus:outline-none focus:ring-2 focus:ring-asm-green-500 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};

export default PrimaryButton;
