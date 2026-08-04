"use client";

import { useState, useRef, useEffect } from "react";

export default function SearchableSelect({ name, options, placeholder, required, searchable = true, defaultValue = "", onChange, multiple = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  // For multiple, selectedValue is an array of strings. For single, it's a string.
  const [selectedValue, setSelectedValue] = useState(
    multiple ? (Array.isArray(defaultValue) ? defaultValue : []) : defaultValue
  );
  
  const wrapperRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options.filter(opt => 
    opt.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleOption = (optValue) => {
    if (multiple) {
      const newSelection = selectedValue.includes(optValue) 
        ? selectedValue.filter(v => v !== optValue)
        : [...selectedValue, optValue];
      setSelectedValue(newSelection);
      if (onChange) onChange(newSelection);
    } else {
      setSelectedValue(optValue);
      setIsOpen(false);
      setSearchTerm("");
      if (onChange) onChange(optValue);
    }
  };

  const getDisplayText = () => {
    if (multiple) {
      if (selectedValue.length === 0) return placeholder;
      const selectedLabels = options
        .filter(opt => selectedValue.includes(opt.value))
        .map(opt => opt.label);
      return selectedLabels.join(", ");
    } else {
      const selectedOption = options.find(opt => opt.value === selectedValue);
      return selectedOption ? selectedOption.label : placeholder;
    }
  };

  const isSelected = (optValue) => {
    return multiple ? selectedValue.includes(optValue) : selectedValue === optValue;
  };

  return (
    <div ref={wrapperRef} style={{ position: "relative", width: "100%" }}>
      {/* Hidden input(s) for form submission */}
      {multiple ? (
        selectedValue.map(val => (
          <input key={val} type="hidden" name={name} value={val} />
        ))
      ) : (
        <input 
          type="hidden" 
          name={name} 
          value={selectedValue} 
          required={required} 
        />
      )}

      {/* Trigger Button */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="input-field"
        style={{ 
          cursor: "pointer", 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          color: (multiple ? selectedValue.length > 0 : selectedValue) ? "var(--foreground)" : "#64748b",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          minHeight: "44px"
        }}
      >
        <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{getDisplayText()}</span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#94a3b8", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s", flexShrink: 0, marginLeft: "8px" }}>
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div style={{
          position: "absolute",
          top: "100%",
          left: 0,
          right: 0,
          marginTop: "0.25rem",
          background: "#ffffff",
          border: "1px solid var(--surface-border)",
          borderRadius: "8px",
          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
          zIndex: 50,
          maxHeight: "250px",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden"
        }}>
          {/* Search Input */}
          {searchable && (
            <div style={{ padding: "0.5rem", borderBottom: "1px solid var(--surface-border)" }}>
              <input 
                type="text" 
                placeholder="Search..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  border: "1px solid #e2e8f0",
                  borderRadius: "4px",
                  fontSize: "0.9rem",
                  outline: "none"
                }}
                autoFocus
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          )}

          {/* Options List */}
          <div style={{ overflowY: "auto", flex: 1 }}>
            {filteredOptions.length === 0 ? (
              <div style={{ padding: "0.75rem 1rem", color: "#94a3b8", fontSize: "0.9rem", textAlign: "center" }}>
                No results found
              </div>
            ) : (
              filteredOptions.map((opt) => (
                <div 
                  key={opt.value}
                  onClick={() => toggleOption(opt.value)}
                  style={{ 
                    padding: "0.75rem 1rem", 
                    cursor: "pointer",
                    fontSize: "0.95rem",
                    background: isSelected(opt.value) ? "rgba(2, 132, 199, 0.05)" : "transparent",
                    color: isSelected(opt.value) ? "var(--primary)" : "var(--foreground)",
                    fontWeight: isSelected(opt.value) ? "600" : "400",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px"
                  }}
                  onMouseOver={(e) => {
                    if (!isSelected(opt.value)) e.currentTarget.style.background = "#f8fafc";
                  }}
                  onMouseOut={(e) => {
                    if (!isSelected(opt.value)) e.currentTarget.style.background = "transparent";
                  }}
                >
                  {multiple && (
                    <div style={{ 
                      width: "16px", 
                      height: "16px", 
                      border: `1px solid ${isSelected(opt.value) ? 'var(--primary)' : '#cbd5e1'}`, 
                      borderRadius: "4px",
                      background: isSelected(opt.value) ? 'var(--primary)' : 'transparent',
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}>
                      {isSelected(opt.value) && (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      )}
                    </div>
                  )}
                  {opt.label}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
