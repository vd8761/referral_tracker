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
        <div className="modal-overlay" onClick={() => setIsOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setIsOpen(false)} className="modal-close-btn">
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
