import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import "./styles/globals.css";
import { AuthProvider } from "./hooks/AuthContext";
import { UserDataProvider } from "./contexts/UserDataContext";

function App() {
  return (
    <Router>
      <AuthProvider>
        <UserDataProvider>
          <AppRoutes />
        </UserDataProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
