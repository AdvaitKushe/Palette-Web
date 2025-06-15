import { twMerge } from "tailwind-merge";
import ModelChoice from "./ModelChoice";

export const ModelDropdown = ({
  onModelSelect,
  className,
}: {
  onModelSelect: (model: string[], company: string) => void;
  className?: string;
}) => {
  return (
    <div
      className={twMerge(
        "absolute left-0 top-full mt-2 bg-zinc-900/95 rounded-lg p-2 shadow-lg w-[200px]",
        className
      )}
    >
      <ModelChoice
        className="w-full"
        company="OpenAI"
        children={[
          ["GPT-4.1", "gpt-4.1"],
          ["GPT-4o", "chatgpt-4o-latest"],
          ["GPT-o4 mini", "o4-mini"],
          ["GPT-o3 mini", "o3-mini"],
          ["GPT-o1", "o1"],
        ]}
        onModelSelect={onModelSelect}
      />
      <ModelChoice
        className="w-full"
        company="Anthropic"
        children={[ ["Claude Sonnet 4", "claude-sonnet-4-20250514"], ["Claude Opus 4", "claude-opus-4-20250514"]]}
        onModelSelect={onModelSelect}
      />
      <ModelChoice
        className="w-full"
        company="Google"
        children={[
          ["Gemini 2.5 Flash", "gemini-2.5-flash-preview-05-20"],
          ["Gemini 2.0 Flash", "gemini-2.0-flash"],
        ]}
        onModelSelect={onModelSelect}
      />
      
    </div>
  );
};
