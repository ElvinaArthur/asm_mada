import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react";
import InputField from "./InputField";
import PrimaryButton from "../buttons/PrimaryButton";

const LoginForm = ({ onSubmit, loading = false }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.email) newErrors.email = "Email requis";
    if (!formData.password) newErrors.password = "Mot de passe requis";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <InputField
        label="Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
        icon={Mail}
        placeholder="votre@email.com"
        disabled={loading}
        required
      />

      <div>
        <InputField
          label="Mot de passe"
          name="password"
          type={showPassword ? "text" : "password"}
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          icon={Lock}
          placeholder="••••••••"
          disabled={loading}
          required
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 mt-1"
          aria-label={
            showPassword ? "Cacher le mot de passe" : "Afficher le mot de passe"
          }
        >
          {showPassword ? (
            <EyeOff className="w-4 h-4" />
          ) : (
            <Eye className="w-4 h-4" />
          )}
        </button>
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center">
          <input
            type="checkbox"
            className="rounded border-gray-300 text-asm-green-600 focus:ring-asm-green-500"
          />
          <span className="ml-2 text-sm text-gray-600">Se souvenir de moi</span>
        </label>
        <button
          type="button"
          onClick={() => {
            /* TODO: forgot password */
          }}
          className="text-sm text-asm-green-600 hover:text-asm-green-700"
        >
          Mot de passe oublié ?
        </button>
      </div>

      <PrimaryButton
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center"
      >
        {loading ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
            Connexion...
          </>
        ) : (
          <>
            <LogIn className="w-5 h-5 mr-2" />
            Se connecter
          </>
        )}
      </PrimaryButton>
    </form>
  );
};

export default LoginForm;
