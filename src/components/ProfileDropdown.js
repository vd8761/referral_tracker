"use client";
import { useState, useRef, useEffect } from "react";
import { User, Key, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";

export default function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} style={{ position: "relative" }}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{ 
          background: "rgba(37, 99, 235, 0.1)", 
          border: "none", 
          color: "var(--primary)",
          width: "36px",
          height: "36px",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          transition: "background 0.2s, transform 0.1s",
          transform: isOpen ? "scale(0.95)" : "scale(1)"
        }}
        aria-label="Profile Menu"
      >
        <User size={18} strokeWidth={2.5} />
      </button>

      {isOpen && (
        <div style={{ 
          position: "absolute", 
          top: "100%", 
          right: 0, 
          marginTop: "0.5rem",
          background: "white", 
          border: "1px solid var(--surface-border)",
          borderRadius: "12px", 
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
          width: "200px",
          zIndex: 100,
          overflow: "hidden"
        }}>
          <Link 
            href="/settings" 
            onClick={() => setIsOpen(false)}
            style={{ 
              display: "flex", alignItems: "center", gap: "0.75rem", 
              padding: "0.85rem 1.25rem", color: "var(--foreground)", 
              textDecoration: "none", fontSize: "0.9rem", fontWeight: "500",
              borderBottom: "1px solid var(--surface-border)",
              transition: "background 0.2s"
            }}
            onMouseOver={(e) => e.currentTarget.style.background = "#f8fafc"}
            onMouseOut={(e) => e.currentTarget.style.background = "transparent"}
          >
            <Key size={16} color="#64748b" />
            <span>Change Password</span>
          </Link>
          <button 
            onClick={() => signOut()}
            style={{ 
              display: "flex", alignItems: "center", gap: "0.75rem", 
              padding: "0.85rem 1.25rem", color: "var(--danger)", 
              background: "transparent", border: "none", width: "100%",
              textAlign: "left", cursor: "pointer", fontSize: "0.9rem", fontWeight: "500",
              transition: "background 0.2s"
            }}
            onMouseOver={(e) => e.currentTarget.style.background = "rgba(239, 68, 68, 0.05)"}
            onMouseOut={(e) => e.currentTarget.style.background = "transparent"}
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  );
}
