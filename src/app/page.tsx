"use client";

import { useState } from "react";
import SplashScreen from "@/components/SplashScreen";
import RegistrationForm from "@/components/RegistrationForm";
import Dashboard from "@/components/Dashboard/Dashboard";

type ViewState = "splash" | "register" | "dashboard";

export default function Home() {
  const [currentView, setCurrentView] = useState<ViewState>("splash");

  const handleSplashComplete = () => {
    setCurrentView("register");
  };

  const handleRegistration = () => {
    setCurrentView("dashboard");
  };

  return (
    <main>
      {currentView === "splash" && (
        <SplashScreen onComplete={handleSplashComplete} />
      )}

      {currentView === "register" && (
        <RegistrationForm onSubmit={handleRegistration} />
      )}

      {currentView === "dashboard" && <Dashboard />}
    </main>
  );
}
