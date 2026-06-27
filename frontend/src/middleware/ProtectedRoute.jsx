'use client';
// frontend/src/middleware/ProtectedRoute.jsx
import React, { useEffect } from "react";
import { useRouter } from 'next/navigation';
import { useAuth } from "../hooks/AuthContext";

const ProtectedRoute = ({ children, requireVerification = true }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth?mode=login");
    }
    if (!loading && user && requireVerification && user.status !== "verified") {
      router.push("/verification-pending");
    }
  }, [loading, user, router, requireVerification]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (requireVerification && user.status !== "verified") {
    return null;
  }

  return children;
};

export default ProtectedRoute;
