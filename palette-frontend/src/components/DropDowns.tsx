import { type ComponentProps, useRef, useEffect } from "react";
import { twMerge } from "tailwind-merge";
import { createPortal } from "react-dom";

export const DropDown = ({
  className,
  children,
  buttonRef,
  onClose,
}: ComponentProps<"div"> & {
  buttonRef: React.RefObject<HTMLElement>;
  onClose: () => void;
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const rect = buttonRef.current?.getBoundingClientRect();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !buttonRef.current?.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return createPortal(
    <div
      ref={dropdownRef}
      style={{
        position: "fixed",
        top: rect ? `${rect.top + 28}px` : 0,
        left: rect ? `${rect.left - 10}px` : 0, // 100px width + 8px margin
      }}
      className={twMerge(
        "bg-black/60 backdrop-blur-md border border-purple-500/20 rounded-lg p-1 shadow-lg w-[100px] z-50",
        className
      )}
    >
      {children}
    </div>,
    document.body
  );
};
