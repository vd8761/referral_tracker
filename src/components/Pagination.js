"use client";

import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function Pagination({ totalPages }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  const createPageURL = (pageNumber) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  if (totalPages <= 1) return null;

  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid var(--surface-border)" }}>
      <Link 
        href={createPageURL(currentPage - 1)} 
        style={{ 
          pointerEvents: currentPage <= 1 ? "none" : "auto", 
          opacity: currentPage <= 1 ? 0.5 : 1,
          padding: "0.5rem 1rem", background: "#f8fafc", border: "1px solid var(--surface-border)", borderRadius: "6px", color: "var(--foreground)", textDecoration: "none", fontSize: "0.9rem", fontWeight: "600"
        }}
      >
        Previous
      </Link>
      
      <span style={{ fontSize: "0.9rem", color: "#64748b" }}>
        Page <strong style={{ color: "var(--foreground)" }}>{currentPage}</strong> of {totalPages}
      </span>

      <Link 
        href={createPageURL(currentPage + 1)} 
        style={{ 
          pointerEvents: currentPage >= totalPages ? "none" : "auto", 
          opacity: currentPage >= totalPages ? 0.5 : 1,
          padding: "0.5rem 1rem", background: "#f8fafc", border: "1px solid var(--surface-border)", borderRadius: "6px", color: "var(--foreground)", textDecoration: "none", fontSize: "0.9rem", fontWeight: "600"
        }}
      >
        Next
      </Link>
    </div>
  );
}
