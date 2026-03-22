// components/DashboardRedirect.jsx ou .tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const DashboardRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirection vers le dashboard après un court délai
    const timer = setTimeout(() => {
      navigate("/dashboard");
    }, 1000); // 1 seconde de délai

    return () => clearTimeout(timer);
  }, [navigate]);

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

// Ajouter l'animation CSS si vous n'utilisez pas de bibliothèque CSS
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(
  `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`,
  styleSheet.cssRules.length,
);

export default DashboardRedirect;
