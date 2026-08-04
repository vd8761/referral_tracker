"use client";

import React, { useState } from "react";

export default function Modal({ buttonText, title, children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="btn-primary" style={{ whiteSpace: "nowrap", padding: "0.5rem 1.25rem", borderRadius: "8px" }}>
        {buttonText}
      </button>

      {isOpen && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
          background: "rgba(15, 23, 42, 0.4)", backdropFilter: "blur(4px)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000
        }}>
          <div style={{
            background: "#ffffff", padding: "2.5rem", borderRadius: "16px",
            width: "100%", maxWidth: "800px", 
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            position: "relative", animation: "slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
          }}>
            <button onClick={() => setIsOpen(false)} style={{
              position: "absolute", top: "1.25rem", right: "1.25rem", background: "none",
              border: "none", fontSize: "1.5rem", cursor: "pointer", color: "#64748b",
              width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%"
            }}
            onMouseOver={(e) => e.currentTarget.style.background = "#f1f5f9"}
            onMouseOut={(e) => e.currentTarget.style.background = "none"}
            >
              ×
            </button>
            <h3 style={{ marginBottom: "1.5rem", fontSize: "1.25rem", fontWeight: "700", color: "var(--foreground)" }}>{title}</h3>
            {/* The children is the Server Action form, which can be rendered here */}
            {React.Children.map(children, child => {
              if (React.isValidElement(child)) {
                return React.cloneElement(child, { closeModal: () => setIsOpen(false) });
              }
              return child;
            })}
          </div>
        </div>
      )}
    </>
  );
}
