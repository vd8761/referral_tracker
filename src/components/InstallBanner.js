"use client";
import { useState, useEffect } from "react";
import { X, Download } from "lucide-react";
import Image from "next/image";

export default function InstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(true);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if dismissed previously
    if (localStorage.getItem("pwa-banner-dismissed") === "true") {
      setDismissed(true);
    }

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
        setIsStandalone(true);
      }
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem("pwa-banner-dismissed", "true");
  };

  if (isStandalone || dismissed) return null;
  if (!deferredPrompt && !isIOS) return null;

  return (
    <div className="install-banner">
      <style>{`
        .install-banner {
          position: fixed;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          width: calc(100% - 40px);
          max-width: 400px;
          background-color: white;
          border-radius: 12px;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
          border: 1px solid #e2e8f0;
          padding: 16px;
          z-index: 9999;
          display: flex;
          align-items: center;
          gap: 12px;
          animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @media (max-width: 768px) {
          .install-banner {
            bottom: 90px; /* Above the 70px bottom tab bar */
          }
        }
        @keyframes slideUp {
          from { transform: translate(-50%, 100%); opacity: 0; }
          to { transform: translate(-50%, 0); opacity: 1; }
        }
        .ios-prompt-arrow {
          font-size: 24px;
          color: var(--primary);
          animation: bounce 1.2s infinite alternate;
          margin: 0 auto;
        }
        @keyframes bounce {
          0% { transform: translateY(0); }
          100% { transform: translateY(6px); }
        }
      `}</style>
      
      {isIOS ? (
        <div style={{ display: "flex", flexDirection: "column", width: "100%", alignItems: "center", textAlign: "center", gap: "8px", position: "relative" }}>
          <button 
            onClick={handleDismiss}
            style={{
              background: "transparent", border: "none", padding: "4px", color: "#94a3b8", cursor: "pointer", position: "absolute", top: "-8px", right: "-8px"
            }}
          >
            <X size={16} />
          </button>
          
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
            <Image src="/logo-icon-custom.jpg" alt="App Icon" width={32} height={32} style={{ borderRadius: "8px" }} />
            <strong style={{ fontSize: "1rem", color: "#0f172a" }}>Install Referral Tracker</strong>
          </div>
          
          <p style={{ margin: 0, fontSize: "0.85rem", color: "#475569" }}>
            Tap <span style={{ display: "inline-block", border: "1px solid #cbd5e1", borderRadius: "4px", padding: "0 4px", fontSize: "1.1em" }}>⎘</span> below, then <strong>"Add to Home Screen"</strong>
          </p>
          <div className="ios-prompt-arrow">↓</div>
        </div>
      ) : (
        <>
          <div style={{
            position: "relative", width: "48px", height: "48px", borderRadius: "10px", overflow: "hidden", flexShrink: 0, backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <Image 
              src="/logo-icon-custom.jpg" 
              alt="App Icon" 
              fill 
              style={{ objectFit: "contain", transform: "scale(1.2)" }}
              unoptimized
            />
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <h4 style={{ margin: "0 0 4px 0", fontSize: "0.9rem", fontWeight: "700", color: "#0f172a" }}>Install Referral Tracker</h4>
            <p style={{ margin: 0, fontSize: "0.75rem", color: "#64748b", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              Add to home screen for quick access
            </p>
          </div>

          <button 
            onClick={handleInstallClick}
            style={{
              backgroundColor: "var(--primary)", color: "white", border: "none", borderRadius: "20px", padding: "8px 16px", fontSize: "0.8rem", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", boxShadow: "0 4px 6px -1px rgba(2, 132, 199, 0.2)"
            }}
          >
            <Download size={14} /> Install
          </button>

          <button 
            onClick={handleDismiss}
            style={{
              background: "transparent", border: "none", padding: "4px", color: "#94a3b8", cursor: "pointer", position: "absolute", top: "8px", right: "8px"
            }}
          >
            <X size={16} />
          </button>
        </>
      )}
    </div>
  );
}
