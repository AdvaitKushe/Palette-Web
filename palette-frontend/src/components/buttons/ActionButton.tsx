import { type ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

export type ActionButtonProps = ComponentProps<"button">;

export const ActionButton = ({ className, children, ...props }: ActionButtonProps) => {
  return (
    <button
      className={twMerge(
        "px-2 py-1 rounded-md border border-purple-400/30 hover:bg-purple-800/30 hover:border-purple-400/50 transition-all duration-200 w-fit backdrop-blur-sm",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
