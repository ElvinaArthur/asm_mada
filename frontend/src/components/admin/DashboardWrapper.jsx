'use client';
// components/DashboardRedirect.jsx
import { useEffect } from "react";
import { useRouter } from 'next/navigation';
import { useAuth } from "../hooks/AuthContext";

const DashboardRedirect = () => {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/auth?mode=login");
      } else if (isAdmin) {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    }
  }, [user, isAdmin, loading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Redirection vers votre dashboard...</p>
      </div>
    </div>
  );
};

export default DashboardRedirect;
