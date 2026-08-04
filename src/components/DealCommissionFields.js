"use client";

import { useState } from "react";
import SearchableSelect from "@/components/SearchableSelect";

export default function DealCommissionFields() {
  const [commissionType, setCommissionType] = useState("PERCENTAGE");

  return (
    <>
      <div>
        <label style={{ display: "block", marginBottom: "0.25rem", fontSize: "0.85rem", color: "#475569", fontWeight: "500" }}>Commission Type <span style={{ color: "#ef4444" }}>*</span></label>
        <SearchableSelect 
          name="commissionType" 
          placeholder="Select Type"
          options={[
            { value: "PERCENTAGE", label: "Percentage (%)" },
            { value: "FIXED", label: "Fixed Amount" }
          ]}
          searchable={false}
          defaultValue="PERCENTAGE"
          onChange={(val) => setCommissionType(val)}
          required 
        />
      </div>
      <div>
        <label style={{ display: "block", marginBottom: "0.25rem", fontSize: "0.85rem", color: "#475569", fontWeight: "500" }}>Commission Value <span style={{ color: "#ef4444" }}>*</span></label>
        <input 
          type="number" 
          step="0.01" 
          name="commissionValue" 
          placeholder="e.g. 10" 
          className="input-field" 
          max={commissionType === "PERCENTAGE" ? "100" : undefined}
          min="0"
          required 
        />
      </div>
    </>
  );
}
