"use client";
import { useState } from "react";
import { changePassword } from "@/lib/actions";
import { Eye, EyeOff } from "lucide-react";

export default function SettingsPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [validationErrors, setValidationErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });
    setValidationErrors({});

    const errors = {};
    if (!currentPassword) errors.currentPassword = "Current password is required";
    if (!newPassword) errors.newPassword = "New password is required";
    if (!confirmPassword) errors.confirmPassword = "Confirm your new password";

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    if (newPassword !== confirmPassword) {
      setValidationErrors({ confirmPassword: "New passwords do not match" });
      return;
    }

    if (newPassword.length < 6) {
      setValidationErrors({ newPassword: "New password must be at least 6 characters" });
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await changePassword(currentPassword, newPassword);
      if (result.success) {
        setMessage({ type: "success", text: result.message });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setMessage({ type: "error", text: result.message });
      }
    } catch (err) {
      setMessage({ type: "error", text: "An unexpected error occurred" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
      </div>
      
      <div className="dashboard-card" style={{ maxWidth: "500px" }}>
        <h3 style={{ marginBottom: "1.5rem", fontSize: "1.2rem", fontWeight: "600" }}>Change Password</h3>
        
        {message.text && (
          <div style={{ 
            padding: "0.75rem", 
            marginBottom: "1.5rem",
            background: message.type === "success" ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)", 
            border: `1px solid ${message.type === "success" ? "rgba(16, 185, 129, 0.2)" : "rgba(239, 68, 68, 0.2)"}`, 
            borderRadius: "0.5rem", 
            color: message.type === "success" ? "var(--success)" : "var(--danger)", 
            fontSize: "0.85rem", 
            textAlign: "center", 
            fontWeight: "600" 
          }}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div style={{ position: "relative" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", color: "#475569", fontWeight: "500" }}>Current Password</label>
            <div style={{ position: "relative" }}>
              <input 
                type={showCurrent ? "text" : "password"} 
                className="input-field" 
                value={currentPassword}
                onChange={e => {
                  setCurrentPassword(e.target.value);
                  if (validationErrors.currentPassword) setValidationErrors({ ...validationErrors, currentPassword: "" });
                }}
                placeholder="Enter current password"
                style={{ borderColor: validationErrors.currentPassword ? "var(--danger)" : undefined, paddingRight: "40px" }}
              />
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setShowCurrent(prev => !prev);
                }}
                style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", background: "transparent", border: "none", cursor: "pointer", color: "#64748b", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10, padding: "4px" }}
              >
                {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {validationErrors.currentPassword && (
              <span style={{ color: "var(--danger)", fontSize: "0.8rem", marginTop: "0.35rem", display: "block", fontWeight: "500" }}>{validationErrors.currentPassword}</span>
            )}
          </div>

          <div style={{ position: "relative" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", color: "#475569", fontWeight: "500" }}>New Password</label>
            <div style={{ position: "relative" }}>
              <input 
                type={showNew ? "text" : "password"} 
                className="input-field" 
                value={newPassword}
                onChange={e => {
                  setNewPassword(e.target.value);
                  if (validationErrors.newPassword) setValidationErrors({ ...validationErrors, newPassword: "" });
                }}
                placeholder="Enter new password"
                style={{ borderColor: validationErrors.newPassword ? "var(--danger)" : undefined, paddingRight: "40px" }}
              />
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setShowNew(prev => !prev);
                }}
                style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", background: "transparent", border: "none", cursor: "pointer", color: "#64748b", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10, padding: "4px" }}
              >
                {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {validationErrors.newPassword && (
              <span style={{ color: "var(--danger)", fontSize: "0.8rem", marginTop: "0.35rem", display: "block", fontWeight: "500" }}>{validationErrors.newPassword}</span>
            )}
          </div>

          <div style={{ position: "relative" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", color: "#475569", fontWeight: "500" }}>Confirm New Password</label>
            <div style={{ position: "relative" }}>
              <input 
                type={showConfirm ? "text" : "password"} 
                className="input-field" 
                value={confirmPassword}
                onChange={e => {
                  setConfirmPassword(e.target.value);
                  if (validationErrors.confirmPassword) setValidationErrors({ ...validationErrors, confirmPassword: "" });
                }}
                placeholder="Re-enter new password"
                style={{ borderColor: validationErrors.confirmPassword ? "var(--danger)" : undefined, paddingRight: "40px" }}
              />
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setShowConfirm(prev => !prev);
                }}
                style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", background: "transparent", border: "none", cursor: "pointer", color: "#64748b", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10, padding: "4px" }}
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {validationErrors.confirmPassword && (
              <span style={{ color: "var(--danger)", fontSize: "0.8rem", marginTop: "0.35rem", display: "block", fontWeight: "500" }}>{validationErrors.confirmPassword}</span>
            )}
          </div>
          
          <button type="submit" className="btn-primary" style={{ marginTop: "0.5rem", opacity: isLoading ? 0.7 : 1 }} disabled={isLoading}>
            {isLoading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
