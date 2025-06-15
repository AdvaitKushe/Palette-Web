import { type ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

export const MarkdownTable = ({ children, className, ...props }: ComponentProps<"table">) => (
  <div className="overflow-x-auto my-4">
    <table
      className={twMerge(
        "min-w-full border-collapse bg-black/20 backdrop-blur-sm rounded-lg overflow-hidden border border-purple-500/30",
        className
      )}
      {...props}
    >
      {children}
    </table>
  </div>
);

export const MarkdownThead = ({ children, className, ...props }: ComponentProps<"thead">) => (
  <thead className={twMerge("bg-purple-800/40", className)} {...props}>
    {children}
  </thead>
);

export const MarkdownTh = ({ children, className, ...props }: ComponentProps<"th">) => (
  <th
    className={twMerge(
      "border border-purple-500/30 px-4 py-3 text-left font-semibold text-purple-200 bg-purple-900/20",
      className
    )}
    {...props}
  >
    {children}
  </th>
);

export const MarkdownTd = ({ children, className, ...props }: ComponentProps<"td">) => (
  <td
    className={twMerge("border border-purple-500/20 px-4 py-2 text-gray-300", className)}
    {...props}
  >
    {children}
  </td>
);

export const MarkdownTr = ({ children, className, ...props }: ComponentProps<"tr">) => (
  <tr
    className={twMerge("hover:bg-purple-900/20 transition-colors duration-200", className)}
    {...props}
  >
    {children}
  </tr>
);
