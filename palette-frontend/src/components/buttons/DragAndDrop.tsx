import { type ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

export const DragAndDrop = ({
  className,
  onClick,
  ...props
}: ComponentProps<"input"> & { onClick?: () => void }) => {
  return (
    <div
      className={twMerge(
        "bg-zinc-900/70 border border-white/20 p-4 rounded-full flex items-center justify-center absolute bottom-[10px] left-2 h-2 w-2 hover:bg-zinc-900/20 transition-all duration-300 cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      <i className="bi bi-paperclip cursor-pointer"></i>
      <input {...props} style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer" }} />
    </div>
  );
};
