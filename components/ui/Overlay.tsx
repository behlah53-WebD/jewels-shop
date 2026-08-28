import React from "react";
import { X } from "lucide-react";

export function Overlay({
  title,
  close,
  children,
}: {
  title: string;
  close: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="overlay">
      <div className="modal">
        <button className="icon close" onClick={close} aria-label="Close overlay">
          <X />
        </button>
        <p>{title}</p>
        {children}
      </div>
    </div>
  );
}
