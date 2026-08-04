"use client";
import { useState, useRef } from "react";
import SearchableSelect from "@/components/SearchableSelect";

export default function DealForm({ action, customers, vendors, closeModal }) {
  const [errors, setErrors] = useState({});
  const [commissionType, setCommissionType] = useState("PERCENTAGE");
  const formRef = useRef(null);

  const validateField = (name, value, currentCommissionType = commissionType) => {
    let error = undefined;
    if (name === "customerId" && !value) error = "Please select a Customer";
    if (name === "vendorIds" && (!value || value.length === 0)) error = "Please select at least one Vendor";
    if (name === "requirementDescription" && (!value || !value.trim())) error = "Requirement Description is required";
    if (name === "dealValue" && !value) error = "Deal Value is required";
    if (name === "commissionValue") {
      if (!value) {
        error = "Commission Value is required";
      } else if (currentCommissionType === "PERCENTAGE" && parseFloat(value) > 100) {
        error = "Percentage cannot exceed 100";
      }
    }
    
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    
    let newErrors = {};
    let isValid = true;

    const customerId = formData.get("customerId");
    const vendorIds = formData.getAll("vendorIds");
    const requirementDescription = formData.get("requirementDescription");
    const dealValue = formData.get("dealValue");
    const commissionValue = formData.get("commissionValue");

    if (!customerId) { newErrors.customerId = "Please select a Customer"; isValid = false; }
    if (!vendorIds || vendorIds.length === 0) { newErrors.vendorIds = "Please select at least one Vendor"; isValid = false; }
    if (!requirementDescription?.trim()) { newErrors.requirementDescription = "Requirement Description is required"; isValid = false; }
    if (!dealValue) { newErrors.dealValue = "Deal Value is required"; isValid = false; }
    
    if (!commissionValue) {
      newErrors.commissionValue = "Commission Value is required";
      isValid = false;
    } else if (commissionType === "PERCENTAGE" && parseFloat(commissionValue) > 100) {
      newErrors.commissionValue = "Percentage cannot exceed 100";
      isValid = false;
    }

    if (isValid) {
      await action(formData);
      form.reset();
      setErrors({});
      setCommissionType("PERCENTAGE");
      if (closeModal) closeModal();
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <div>
          <label style={{ display: "block", marginBottom: "0.25rem", fontSize: "0.85rem", color: "#475569", fontWeight: "500" }}>
            Customer <span style={{ color: "#ef4444" }}>*</span>
          </label>
          <div style={{ border: errors.customerId ? "1px solid #ef4444" : "none", borderRadius: "8px" }}>
            <SearchableSelect 
              name="customerId" 
              placeholder="Select Customer"
              options={customers.map(c => ({ value: c.id, label: c.companyName }))} 
              onChange={(val) => validateField("customerId", val)}
            />
          </div>
          {errors.customerId && <span style={{ color: "#ef4444", fontSize: "0.75rem", marginTop: "0.25rem", display: "block" }}>{errors.customerId}</span>}
        </div>
        <div>
          <label style={{ display: "block", marginBottom: "0.25rem", fontSize: "0.85rem", color: "#475569", fontWeight: "500" }}>
            Vendor <span style={{ color: "#ef4444" }}>*</span>
          </label>
          <div style={{ border: errors.vendorIds ? "1px solid #ef4444" : "none", borderRadius: "8px" }}>
            <SearchableSelect 
              name="vendorIds" 
              placeholder="Select Vendor(s)"
              multiple={true}
              options={vendors.map(v => ({ value: v.id, label: v.companyName }))} 
              onChange={(val) => validateField("vendorIds", val)}
            />
          </div>
          {errors.vendorIds && <span style={{ color: "#ef4444", fontSize: "0.75rem", marginTop: "0.25rem", display: "block" }}>{errors.vendorIds}</span>}
        </div>
      </div>

      <div>
        <label style={{ display: "block", marginBottom: "0.25rem", fontSize: "0.85rem", color: "#475569", fontWeight: "500" }}>
          Requirement Description <span style={{ color: "#ef4444" }}>*</span>
        </label>
        <textarea 
          name="requirementDescription" 
          placeholder="What does the customer need?" 
          className="input-field" 
          rows={2}
          onChange={handleInputChange}
          onKeyUp={handleInputChange}
          style={{ borderColor: errors.requirementDescription ? "#ef4444" : undefined }}
        ></textarea>
        {errors.requirementDescription && <span style={{ color: "#ef4444", fontSize: "0.75rem", marginTop: "0.25rem", display: "block" }}>{errors.requirementDescription}</span>}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
        <div>
          <label style={{ display: "block", marginBottom: "0.25rem", fontSize: "0.85rem", color: "#475569", fontWeight: "500" }}>
            Deal Value (Total) <span style={{ color: "#ef4444" }}>*</span>
          </label>
          <input 
            type="number" 
            step="0.01" 
            name="dealValue" 
            placeholder="e.g. 100000" 
            className="input-field"
            onChange={handleInputChange}
            onKeyUp={handleInputChange}
            style={{ borderColor: errors.dealValue ? "#ef4444" : undefined }}
          />
          {errors.dealValue && <span style={{ color: "#ef4444", fontSize: "0.75rem", marginTop: "0.25rem", display: "block" }}>{errors.dealValue}</span>}
        </div>
        <div>
          <label style={{ display: "block", marginBottom: "0.25rem", fontSize: "0.85rem", color: "#475569", fontWeight: "500" }}>
            Commission Type <span style={{ color: "#ef4444" }}>*</span>
          </label>
          <SearchableSelect 
            name="commissionType" 
            placeholder="Select Type"
            options={[
              { value: "PERCENTAGE", label: "Percentage (%)" },
              { value: "FIXED", label: "Fixed Amount" }
            ]}
            searchable={false}
            defaultValue="PERCENTAGE"
            onChange={(val) => {
              setCommissionType(val);
              // Re-validate commissionValue when type changes, if there's a value
              if (formRef.current) {
                const cv = formRef.current.commissionValue?.value;
                if (cv) validateField("commissionValue", cv, val);
              }
            }}
          />
        </div>
        <div>
          <label style={{ display: "block", marginBottom: "0.25rem", fontSize: "0.85rem", color: "#475569", fontWeight: "500" }}>
            Commission Value <span style={{ color: "#ef4444" }}>*</span>
          </label>
          <input 
            type="number" 
            step="0.01" 
            name="commissionValue" 
            placeholder="e.g. 10" 
            className="input-field" 
            max={commissionType === "PERCENTAGE" ? "100" : undefined}
            min="0"
            onChange={handleInputChange}
            onKeyUp={handleInputChange}
            style={{ borderColor: errors.commissionValue ? "#ef4444" : undefined }}
          />
          {errors.commissionValue && <span style={{ color: "#ef4444", fontSize: "0.75rem", marginTop: "0.25rem", display: "block" }}>{errors.commissionValue}</span>}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <div>
          <label style={{ display: "block", marginBottom: "0.25rem", fontSize: "0.85rem", color: "#475569", fontWeight: "500" }}>Deal Status <span style={{ color: "#ef4444" }}>*</span></label>
          <SearchableSelect 
            name="dealStatus" 
            placeholder="Select Status"
            options={[
              { value: "OPEN", label: "Open" },
              { value: "CLOSED", label: "Closed (Won)" }
            ]}
            searchable={false}
            defaultValue="OPEN"
          />
        </div>
        <div>
          <label style={{ display: "block", marginBottom: "0.25rem", fontSize: "0.85rem", color: "#475569", fontWeight: "500" }}>Commission Status <span style={{ color: "#ef4444" }}>*</span></label>
          <SearchableSelect 
            name="commissionStatus" 
            placeholder="Select Status"
            options={[
              { value: "PENDING", label: "Pending" },
              { value: "RECEIVED", label: "Received" }
            ]}
            searchable={false}
            defaultValue="PENDING"
          />
        </div>
      </div>

      <button type="submit" className="btn-primary" style={{ marginTop: "0.5rem" }}>Create Deal</button>
    </form>
  );
}
