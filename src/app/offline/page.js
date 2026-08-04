import { WifiOff } from "lucide-react";

export default function OfflinePage() {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      backgroundColor: "#f8fafc",
      padding: "2rem",
      textAlign: "center"
    }}>
      <div style={{
        backgroundColor: "#ffffff",
        padding: "3rem",
        borderRadius: "16px",
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        maxWidth: "400px"
      }}>
        <div style={{
          width: "80px",
          height: "80px",
          backgroundColor: "rgba(239, 68, 68, 0.1)",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "1.5rem"
        }}>
          <WifiOff size={40} color="#ef4444" />
        </div>
        
        <h1 style={{ margin: "0 0 1rem 0", fontSize: "1.5rem", color: "#0f172a" }}>You're Offline</h1>
        <p style={{ margin: "0 0 2rem 0", color: "#64748b", lineHeight: "1.5" }}>
          It looks like you've lost your internet connection. Don't worry, your data is safe! Please check your network and try again.
        </p>
        
        <button 
          onClick={() => window.location.reload()}
          style={{
            backgroundColor: "#2563eb",
            color: "white",
            border: "none",
            padding: "0.75rem 2rem",
            borderRadius: "8px",
            fontSize: "1rem",
            fontWeight: "600",
            cursor: "pointer",
            width: "100%",
            transition: "all 0.2s"
          }}
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
