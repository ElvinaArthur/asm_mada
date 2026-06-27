'use client';
// components/DashboardRedirect.jsx ou .tsx
import { useEffect } from "react";
import { useRouter } from 'next/navigation';

const DashboardRedirect = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirection vers le dashboard après un court délai
    const timer = setTimeout(() => {
      router.push("/dashboard");
    }, 1000); // 1 seconde de délai

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div style={styles.container}>
      <div style={styles.loader}></div>
      <p>Redirection vers le tableau de bord...</p>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
  },
  loader: {
    border: "4px solid #f3f3f3",
    borderTop: "4px solid #3498db",
    borderRadius: "50%",
    width: "40px",
    height: "40px",
    animation: "spin 1s linear infinite",
    marginBottom: "20px",
  },
};


export default DashboardRedirect;
