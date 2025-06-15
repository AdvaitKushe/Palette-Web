import { type ComponentProps } from "react";
import { twMerge } from "tailwind-merge";
import { ModelPicker } from "./ModelPicker";
import { Profile } from "../Profile";
import { Settings } from "./Settings";

export const ContentActionRow = ({ className, ...props }: ComponentProps<"div">) => {
  return (
    <div
      className={twMerge("flex flex-row items-center justify-between px-4 py-2", className)}
      {...props}
    >
      <div className="flex flex-row items-end gap-2">
        <ModelPicker />
      </div>
      <div className="flex items-center gap-[5px]  ">
        <Settings className="cursor-pointer" />
        <Profile className="ml-2 cursor-pointer " />
      </div>
    </div>
  );
};
