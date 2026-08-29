import Link from "next/link";
import React from "react";

export function Btn({
  children,
  className = "",
  onClick,
  type = "button",
  disabled = false,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}) {
  if (
    typeof children === "string" &&
    children.includes("Preview order confirmation")
  ) {
    return (
      <Link href="/order-confirmation" className={`btn ${className}`}>
        {children}
      </Link>
    );
  }
  return (
    <button
      className={`btn ${className}`}
      onClick={onClick}
      type={type}
      disabled={disabled}
      suppressHydrationWarning={true}
    >
      {children}
    </button>
  );
}
