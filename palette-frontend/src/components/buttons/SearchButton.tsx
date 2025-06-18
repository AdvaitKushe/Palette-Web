import { type ComponentProps } from "react";
import { twMerge } from "tailwind-merge";
import { useAtom } from "jotai";
import { selectedModelAtom, searchEnabledAtom } from "../../store";

export const SearchButton = ({
  className,
  model,
  ...props
}: ComponentProps<"button"> & { model: string[] }) => {
  const [isSearchEnabled, setIsSearchEnabled] = useAtom(searchEnabledAtom);
  const [, setSelectedModel] = useAtom(selectedModelAtom);
  
  const handleSearchToggle = () => {
    const newIsSearchEnabled = !isSearchEnabled;
    setIsSearchEnabled(newIsSearchEnabled);

    // Update the model ID based on search state special case for openai to avoid redundancy in backend
    let newModelId = model[1];
    if (newIsSearchEnabled) {
      // Add search suffix to model ID
      if (model[1] === "chatgpt-4o-latest") {
        newModelId = "gpt-4o-search-preview";
      } else if (model[1] === "o4-mini") {
        newModelId = "gpt-4o-mini-search-preview";
      }
    }

    // Update the selected model with the new ID
    setSelectedModel([model[0], newModelId, model[2]]);
  };

  return (
    <button
      className={twMerge(
        "bg-zinc-900/70 border border-white/20  rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-zinc-900/20 transition-all duration-300 w-21 h-7",
        isSearchEnabled && "text-blue-400 border-blue-400/50",
        className
      )}
      onClick={handleSearchToggle}
      title={isSearchEnabled ? "Disable Search" : "Enable Search"}
      {...props}
    >
      <i className={twMerge("bi bi-search text-xs ", isSearchEnabled && "text-blue-400")}>
        {" "}
        Search{" "}
      </i>
    </button>
  );
};
