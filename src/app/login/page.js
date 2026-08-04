"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Montserrat } from "next/font/google";
import { Eye, EyeOff } from "lucide-react";
import logoIcon from "../../../public/logo-icon-custom.jpg";

const montserrat = Montserrat({ subsets: ["latin"], weight: ["500", "600", "700"] });

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const errors = {};
    if (!email) errors.email = "Email is required";
    if (!password) errors.password = "Password is required";
    
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setValidationErrors({});
    setError("");
    setIsLoading(true);
    
    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid email or password");
        setIsLoading(false);
      } else {
        router.push("/");
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred");
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: "1rem" }}>
      <div style={{ width: "100%", maxWidth: "400px", padding: "1rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", userSelect: "none", marginBottom: "1.5rem" }}>
            <div style={{
              position: "relative",
              width: "48px",
              height: "48px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              overflow: "hidden",
              pointerEvents: "none"
            }}>
              <img 
                src={logoIcon.src} 
                alt="Logo Icon" 
                style={{ width: "100%", height: "100%", objectFit: "contain", mixBlendMode: "darken", transform: "scale(1.2)" }}
              />
            </div>
            <div className={montserrat.className} style={{ fontSize: "1.5rem", fontWeight: "700", letterSpacing: "-0.2px", color: "#0f172a" }}>
              ReferralTracker
            </div>
          </div>
          <h1 className="page-title" style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>Welcome Back</h1>
          <p style={{ color: "#64748b", fontSize: "0.95rem" }}>Sign in to manage your referrals</p>
        </div>
        
        {error && (
          <div style={{ padding: "0.75rem", background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)", borderRadius: "0.5rem", color: "var(--danger)", fontSize: "0.85rem", textAlign: "center", fontWeight: "600" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", color: "#475569", fontWeight: "500" }}>Email</label>
            <input 
              type="email" 
              className="input-field" 
              value={email}
              onChange={e => {
                setEmail(e.target.value);
                if (validationErrors.email) setValidationErrors({ ...validationErrors, email: "" });
              }}
              placeholder="e.g. admin@example.com"
              style={{ borderColor: validationErrors.email ? "var(--danger)" : undefined }}
            />
            {validationErrors.email && (
              <span style={{ color: "var(--danger)", fontSize: "0.8rem", marginTop: "0.35rem", display: "block", fontWeight: "500" }}>{validationErrors.email}</span>
            )}
          </div>
          <div style={{ position: "relative" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", color: "#475569", fontWeight: "500" }}>Password</label>
            <div style={{ position: "relative" }}>
              <input 
                type={showPassword ? "text" : "password"} 
                className="input-field" 
                value={password}
                onChange={e => {
                  setPassword(e.target.value);
                  if (validationErrors.password) setValidationErrors({ ...validationErrors, password: "" });
                }}
                placeholder="Enter your password"
                style={{ borderColor: validationErrors.password ? "var(--danger)" : undefined, paddingRight: "40px" }}
              />
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setShowPassword(prev => !prev);
                }}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "#64748b",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 10,
                  padding: "4px"
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {validationErrors.password && (
              <span style={{ color: "var(--danger)", fontSize: "0.8rem", marginTop: "0.35rem", display: "block", fontWeight: "500" }}>{validationErrors.password}</span>
            )}
          </div>
          <button type="submit" className="btn-primary" style={{ marginTop: "0.5rem", opacity: isLoading ? 0.7 : 1 }} disabled={isLoading}>
            {isLoading ? "Signing In..." : "Sign In"}
          </button>
        </form>
        
      </div>
    </div>
  );
}
