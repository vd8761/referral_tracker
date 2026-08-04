"use client";
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

export default function Tooltip({ text, children }) {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);
  const triggerRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleMouseEnter = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setCoords({
        x: rect.left + rect.width / 2,
        y: rect.top + window.scrollY - 8
      });
    }
    setIsVisible(true);
  };

  const handleMouseLeave = () => setIsVisible(false);

  return (
    <>
      <div 
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{ display: "inline-block", maxWidth: "100%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
      >
        {children}
      </div>
      
      {mounted && isVisible && createPortal(
        <div style={{
          position: "absolute",
          top: coords.y,
          left: coords.x,
          transform: "translate(-50%, -100%)",
          backgroundColor: "#1e293b",
          color: "#fff",
          padding: "8px 12px",
          borderRadius: "6px",
          fontSize: "0.8rem",
          maxWidth: "350px",
          whiteSpace: "normal",
          wordWrap: "break-word",
          zIndex: 9999,
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          pointerEvents: "none",
          textAlign: "center"
        }}>
          {text}
          <div style={{
            position: "absolute",
            top: "100%",
            left: "50%",
            transform: "translateX(-50%)",
            borderWidth: "5px",
            borderStyle: "solid",
            borderColor: "#1e293b transparent transparent transparent"
          }}></div>
        </div>,
        document.body
      )}
    </>
  );
}
