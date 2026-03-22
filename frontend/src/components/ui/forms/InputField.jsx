import React, { forwardRef } from "react";
import { AlertCircle } from "lucide-react";

const InputField = forwardRef(
  (
    { label, type = "text", error, icon: Icon, className = "", ...props },
    ref,
  ) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <div className="relative">
          {Icon && (
            <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          )}
          <input
            ref={ref}
            type={type}
            className={`
            w-full ${Icon ? "pl-10" : "pl-3"} pr-3 py-2 
            border rounded-lg focus:ring-2 focus:ring-asm-green-500 focus:border-transparent
            ${error ? "border-red-500" : "border-gray-300"}
            disabled:opacity-50 disabled:cursor-not-allowed
            ${className}
          `}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-1 text-sm text-red-600 flex items-center">
            <AlertCircle className="w-3 h-3 mr-1" />
            {error}
          </p>
        )}
      </div>
    );
  },
);

InputField.displayName = "InputField";

export default InputField;
