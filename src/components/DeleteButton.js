"use client";
import { useFormStatus } from "react-dom";
import { useState, useEffect } from "react";
import { AlertTriangle, Trash2 } from "lucide-react";

export default function DeleteButton({ itemType = "item", iconOnly = false }) {
  const { pending } = useFormStatus();
  const [showConfirm, setShowConfirm] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <>
      {iconOnly ? (
        <button 
          type="button" 
          disabled={pending}
          title={`Delete ${itemType}`}
          onClick={(e) => {
            e.preventDefault();
            setShowConfirm(true);
          }}
          style={{ background: "none", border: "none", color: "#ef4444", cursor: pending ? "not-allowed" : "pointer", display: "flex", padding: "4px", opacity: pending ? 0.4 : 0.6 }}
        >
          <Trash2 size={18} />
        </button>
      ) : (
        <button 
          type="button" 
          disabled={pending}
          onClick={(e) => {
            e.preventDefault();
            setShowConfirm(true);
          }}
          style={{ 
            background: "rgba(239, 68, 68, 0.1)", 
            color: "var(--danger)", 
            border: "1px solid rgba(239, 68, 68, 0.2)", 
            padding: "0.4rem 0.75rem", 
            borderRadius: "6px", 
            cursor: pending ? "not-allowed" : "pointer", 
            fontSize: "0.8rem", 
            fontWeight: "600", 
            whiteSpace: "nowrap",
            opacity: pending ? 0.7 : 1
          }}
        >
          {pending ? "Deleting..." : "Delete"}
        </button>
      )}

      {mounted && showConfirm && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(15, 23, 42, 0.6)",
          backdropFilter: "blur(4px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999
        }} onClick={(e) => {
            e.preventDefault();
            setShowConfirm(false);
        }}>
          <div style={{
            background: "#ffffff",
            borderRadius: "12px",
            width: "90%",
            maxWidth: "400px",
            padding: "1.5rem",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
            display: "flex",
            flexDirection: "column",
            gap: "1rem"
          }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
              <div style={{ background: "rgba(239, 68, 68, 0.1)", color: "var(--danger)", padding: "0.75rem", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <AlertTriangle size={24} />
              </div>
              <div style={{ flex: 1, textAlign: "left" }}>
                <h3 style={{ fontSize: "1.15rem", fontWeight: "700", color: "var(--foreground)", marginBottom: "0.25rem", marginTop: "0.2rem" }}>
                  Delete {itemType}
                </h3>
                <p style={{ color: "#64748b", fontSize: "0.95rem", lineHeight: "1.5" }}>
                  Are you sure you want to delete this {itemType}? This action cannot be undone.
                </p>
              </div>
            </div>
            
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1rem" }}>
              <button 
                type="button" 
                disabled={pending}
                onClick={() => setShowConfirm(false)}
                style={{
                  padding: "0.6rem 1rem",
                  borderRadius: "6px",
                  background: "#f1f5f9",
                  color: "#475569",
                  border: "none",
                  fontWeight: "600",
                  cursor: pending ? "not-allowed" : "pointer"
                }}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={pending}
                onClick={() => {
                  // Keep modal open while pending
                }}
                style={{
                  padding: "0.6rem 1rem",
                  borderRadius: "6px",
                  background: "var(--danger)",
                  color: "white",
                  border: "none",
                  fontWeight: "600",
                  cursor: pending ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem"
                }}
              >
                {pending ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
