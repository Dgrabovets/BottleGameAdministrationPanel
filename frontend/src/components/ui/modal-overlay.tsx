"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

/** Props of the modal overlay */
type ModalOverlayProps = {
  children: ReactNode;
};

/** Dark overlay that centers a modal window */
export function ModalOverlay({ children }: ModalOverlayProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4">
      {children}
    </div>,
    document.body,
  );
}
