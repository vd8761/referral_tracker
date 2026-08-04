"use client";
import { useState, useEffect } from "react";
import { Download } from "lucide-react";

export default function InstallAppButton() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(true);

  useEffect(() => {
    const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches 
      || window.navigator.standalone 
      || document.referrer.includes('android-app://');
    
    setIsStandalone(isStandaloneMode);

    const isIosDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    setIsIOS(isIosDevice);

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsStandalone(false);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      alert("To install on iOS:\n1. Tap the Share button at the bottom of Safari.\n2. Scroll down and tap 'Add to Home Screen'.");
      return;
    }
    
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    }
  };

  if (isStandalone) return null;
  if (!deferredPrompt && !isIOS) return null;

  return (
    <button 
      onClick={handleInstallClick}
      className="nav-item install-btn" 
      style={{ 
        background: "rgba(2, 132, 199, 0.1)", 
        border: "1px dashed var(--primary)", 
        cursor: "pointer", 
        width: "100%", 
        textAlign: "left", 
        color: "var(--primary)", 
        marginTop: "1rem",
        marginBottom: "0.5rem",
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        padding: "0.75rem 1rem",
        borderRadius: "8px",
        fontWeight: "600",
        transition: "all 0.2s"
      }}
    >
      <Download size={20} />
      <span className="nav-label">Install App</span>
    </button>
  );
}
