"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition, useState } from "react";
import { Search as SearchIcon } from "lucide-react";

export default function Search({ placeholder }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [isPending, startTransition] = useTransition();
  const [term, setTerm] = useState(searchParams.get("query")?.toString() || "");

  const handleSearch = (e) => {
    const value = e.target.value;
    setTerm(value);
    
    startTransition(() => {
      const params = new URLSearchParams(searchParams);
      params.set("page", "1"); // Reset to page 1 on new search
      if (value) {
        params.set("query", value);
      } else {
        params.delete("query");
      }
      replace(`${pathname}?${params.toString()}`);
    });
  };

  return (
    <div style={{ position: "relative", flex: 1, minWidth: "250px" }}>
      <input
        type="text"
        className="input-field"
        placeholder={placeholder}
        onChange={handleSearch}
        value={term}
        style={{ paddingLeft: "2.5rem", marginBottom: 0 }}
      />
      <span style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "#94a3b8", display: "flex", alignItems: "center" }}>
        <SearchIcon size={18} />
      </span>
      {isPending && <span style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "#94a3b8", fontSize: "0.8rem" }}>Loading...</span>}
    </div>
  );
}
