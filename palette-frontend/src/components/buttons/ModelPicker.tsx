import { type ComponentProps, useState, useEffect, useRef } from "react";
import { twMerge } from "tailwind-merge";
import { ActionButton } from "./ActionButton";
import { ModelDropdown } from "./ModelDropdown";
import { useAtom, useSetAtom } from "jotai";
import { selectedModelAtom, modelSearchCapabilityAtom, searchEnabledAtom } from "../../store";

export const ModelPicker = ({ className, ...props }: ComponentProps<"div">) => {
  const [model, setModel] = useAtom(selectedModelAtom);
  const [, setSearchCapability] = useAtom(modelSearchCapabilityAtom);
  const setSearchEnabled = useSetAtom(searchEnabledAtom)
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleModelSelect = (
    modelInfo: [string, string, boolean, boolean, boolean],
    company: string
  ) => {
    // modelInfo[0] is the model name, modelInfo[1] is the model id, modelInfo[4] is search capability
    setModel([company, modelInfo[1], `${company} ${modelInfo[0]}`]);
    setSearchCapability(modelInfo[4]);
    setIsOpen(false);
    setSearchEnabled(false)
  };

  return (
    <div
      ref={dropdownRef}
      className={twMerge("flex flex-col items-center justify-center z-50 relative", className)}
      {...props}
    >
      <button
        className={twMerge(
          "flex flex-row items-center justify-between px-3 py-1.5 w-full text-white/70 hover:text-white transition-colors duration-200",
          isOpen ? "bg-zinc-700/50 text-white" : ""
        )}
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        <div className="flex flex-row items-center gap-2">
          <i className="bi bi-robot text-sm"></i>
          <span className="text-sm">{model[2]}</span>
        </div>
        <i className="bi bi-chevron-down text-sm"></i>
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-[280px]">
          <ModelDropdown
            className="bg-zinc-800/95 border border-zinc-400/30 rounded-lg shadow-lg"
            onModelSelect={handleModelSelect}
          />
        </div>
      )}
    </div>
  );
};
