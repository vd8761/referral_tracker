"use client";

import { useFormStatus } from "react-dom";

export default function SubmitButton({ 
  defaultText, 
  loadingText, 
  style, 
  className 
}) {
  const { pending } = useFormStatus();

  return (
    <button 
      type="submit" 
      disabled={pending}
      style={{
        ...style,
        opacity: pending ? 0.7 : 1,
        cursor: pending ? "not-allowed" : "pointer"
      }}
      className={className}
    >
      {pending ? loadingText : defaultText}
    </button>
  );
}
