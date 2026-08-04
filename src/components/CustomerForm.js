"use client";
import { useState } from "react";

export default function CustomerForm({ action, closeModal }) {
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    let newErrors = {};
    let isValid = true;

    if (!form.companyName.value.trim()) {
      newErrors.companyName = "Company Name is required";
      isValid = false;
    }

    if (isValid) {
      const formData = new FormData(form);
      await action(formData);
      form.reset();
      setErrors({});
      if (closeModal) closeModal();
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <div>
        <label style={{ display: "block", marginBottom: "0.25rem", fontSize: "0.85rem", color: "#475569", fontWeight: "500" }}>
          Company Name <span style={{ color: "#ef4444" }}>*</span>
        </label>
        <input 
          type="text" 
          name="companyName" 
          placeholder="e.g. Acme Corp" 
          className="input-field" 
          style={{ borderColor: errors.companyName ? "#ef4444" : undefined }}
        />
        {errors.companyName && <span style={{ color: "#ef4444", fontSize: "0.75rem", marginTop: "0.25rem", display: "block" }}>{errors.companyName}</span>}
      </div>
      
      <div className="form-grid-2">
        <div>
          <label style={{ display: "block", marginBottom: "0.25rem", fontSize: "0.85rem", color: "#475569", fontWeight: "500" }}>Contact Person</label>
          <input type="text" name="contactPerson" placeholder="e.g. John Doe" className="input-field" />
        </div>
        <div>
          <label style={{ display: "block", marginBottom: "0.25rem", fontSize: "0.85rem", color: "#475569", fontWeight: "500" }}>Phone Number</label>
          <input type="text" name="phone" placeholder="e.g. +1 234 567 890" className="input-field" />
        </div>
      </div>
      
      <div>
        <label style={{ display: "block", marginBottom: "0.25rem", fontSize: "0.85rem", color: "#475569", fontWeight: "500" }}>Email Address</label>
        <input type="email" name="email" placeholder="e.g. john@acme.com" className="input-field" />
      </div>
      
      <div>
        <label style={{ display: "block", marginBottom: "0.25rem", fontSize: "0.85rem", color: "#475569", fontWeight: "500" }}>Notes</label>
        <textarea name="notes" placeholder="Notes / Requirements context" className="input-field" rows={3}></textarea>
      </div>
      
      <button type="submit" className="btn-primary" style={{ marginTop: "0.5rem" }}>Save Customer</button>
    </form>
  );
}
