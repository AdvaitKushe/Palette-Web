import { type ComponentProps, useState } from "react";
import { twMerge } from "tailwind-merge";
import { ActionButton } from "./ActionButton";

export const ModelDropdown = ({
  className,
  onModelSelect,
  ...props
}: ComponentProps<"div"> & { onModelSelect: (model: string[], company: string) => void }) => {
  const [showAll, setShowAll] = useState(false);

  const models = {
    OpenAI: [
      ["GPT-4.1", "gpt-4.1"],
      ["GPT-4o", "chatgpt-4o-latest"],
      ...(showAll
        ? [
            ["GPT-o4 mini", "o4-mini"],
            ["GPT-o3 mini", "o3-mini"],
            ["GPT-o1", "o1"],

          ]
        : []),
    ],
    Anthropic: [
      ["Claude Sonnet 4", "claude-sonnet-4-20250514"],
      ["Claude Opus 4", "claude-opus-4-20250514"],
      ...(showAll
        ? [
            ["Claude 3.7 Sonnet", "claude-3-7-sonnet-latest"],
            ["Claude 3.7 haiku", "claude-3-7-haiku-latest"],
          ]
        : []),
    ],
    Google: [
      ["Gemini 2.5 Flash", "gemini-2.5-flash-preview-05-20"],
      ["Gemini 2.0 Flash", "gemini-2.0-flash"],
      ...(showAll ? [
        ["Gemini 2.5 Flash Lite", "gemini-2.5-flash-lite-preview-06-17"],
        ["Gemini 2.0 Flash Lite", "gemini-2.0-flash-lite"],
        ["Gemini 1.5 Flash", "gemini-1.5-flash"]
      ] : []),
    ],
  };

  return (
    <div className={twMerge("flex flex-col p-2 gap-1 ", className)} {...props}>
      {Object.entries(models).map(([company, companyModels]) => (
        <div key={company} className="flex flex-col gap-1">
          <div className="text-xs text-white/50 px-2 py-1 font-bold">{company}</div>
          {companyModels.map((model) => (
            <button
              key={model[1]}
              className="flex flex-row items-center gap-2 px-2 py-1.5 text-sm text-white/70 hover:text-white hover:bg-zinc-700/50 rounded-md transition-colors duration-200"
              onClick={() => onModelSelect(model, company)}
            >
              <i className="bi bi-robot text-sm"></i>
              <span>{model[0]}</span>
            </button>
          ))}
        </div>
      ))}
      <button
        className="flex flex-row items-center gap-2 px-2 py-1.5 mt-1 text-sm text-white/50 hover:text-white hover:bg-zinc-700/50 rounded-md transition-colors duration-200 border-t border-zinc-700/50 pt-2"
        onClick={() => setShowAll(!showAll)}
      >
        <i className={`bi bi-chevron-${showAll ? "up" : "down"} text-sm`}></i>
        <span>{showAll ? "Show Less" : "See All Models"}</span>
      </button>
    </div>
  );
};
