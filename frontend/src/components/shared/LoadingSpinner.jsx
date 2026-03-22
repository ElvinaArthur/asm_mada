import React from "react";

const LoadingSpinner = ({ size = "md", fullPage = false }) => {
  const sizes = {
    sm: "w-6 h-6 border-2",
    md: "w-12 h-12 border-4",
    lg: "w-16 h-16 border-4",
  };

  const spinner = (
    <div className="relative">
      <div className={`${sizes[size]} border-asm-green-200 rounded-full`} />
      <div
        className={`${sizes[size]} border-asm-green-600 border-t-transparent rounded-full absolute top-0 animate-spin`}
      />
    </div>
  );

  // fullPage=true → couvre tout l'écran (ex: auth check initial)
  if (fullPage) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex justify-center items-center z-50">
        {spinner}
      </div>
    );
  }

  // Par défaut → centré dans son conteneur
  return <div className="flex justify-center items-center h-64">{spinner}</div>;
};

export default LoadingSpinner;
