/* eslint-disable react/display-name */
import { type ComponentProps, forwardRef } from "react";
import { twMerge } from "tailwind-merge";

//twMerge -> this merges the incoming className values with the ones we define all default RootLayouts should have

export const RootLayout = ({ children, className, ...props }: ComponentProps<"main">) => {
  //this extends the main tag, so all main tags will be compatible with this component, and we can pass in any other props
  return (
    <main className={twMerge("flex flex-row h-screen", className)} {...props}>
      {children}
    </main>
  );
};
export const RootSignIn = ({ children, className, ...props }: ComponentProps<"main">) => {
  //this extends the main tag, so all main tags will be compatible with this component, and we can pass in any other props
  return (
    <main className={twMerge("flex flex-col h-screen w-full", className)} {...props}>
      {children}
    </main>
  );
};
export const Sidebar = ({ children, className, ...props }: ComponentProps<"aside">) => {
  return (
    <aside
      className={twMerge("w-1/5 mt-10 h-screen overflow-hidden p-4 select-none", className)}
      {...props}
    >
      {children}
    </aside>
  );
};

export const Content = forwardRef<HTMLDivElement, ComponentProps<"div">>(
  ({ children, className, ...props }, ref) => {
    return (
      <div ref={ref} className={twMerge("flex-1 overflow-auto", className)} {...props}>
        {children}
      </div>
    );
  }
);
