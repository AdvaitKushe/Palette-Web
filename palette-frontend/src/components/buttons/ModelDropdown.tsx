import { type ComponentProps, useState } from "react";
import { twMerge } from "tailwind-merge";
import { ActionButton } from "./ActionButton";

type ModelInfo = [string, string, boolean, boolean, boolean]; // [name, id, supportsImages, supportsDocuments, supportsSearch]

export const ModelDropdown = ({
  className,
  onModelSelect,
  ...props
}: ComponentProps<"div"> & { onModelSelect: (model: ModelInfo, company: string) => void }) => {
  const [showAll, setShowAll] = useState(false);

  const models: Record<string, ModelInfo[]> = {
    OpenAI: [
      ["GPT-4.1", "gpt-4.1", true, true, false],
      ["GPT-4o", "chatgpt-4o-latest", true, true, true],
      ...(showAll
        ? ([
            ["GPT-o4 mini", "o4-mini", true, true, true],
            ["GPT-o3 mini", "o3-mini", true, true, false],
            ["GPT-o1", "o1", true, true, false],
          ] as ModelInfo[])
        : []),
    ],
    Anthropic: [
      ["Claude Sonnet 4", "claude-sonnet-4-20250514", true, true, true],
      ["Claude Opus 4", "claude-opus-4-20250514", true, true, true],
      ...(showAll
        ? ([
            ["Claude 3.7 Sonnet", "claude-3-7-sonnet-latest", true, true, true],
            ["Claude 3.5 Haiku", "claude-3-5-haiku-20241022", true, true, false],
          ] as ModelInfo[])
        : []),
    ],
    Google: [
      ["Gemini 2.5 Flash", "gemini-2.5-flash-preview-05-20", true, true, true],
      ["Gemini 2.0 Flash", "gemini-2.0-flash", true, true, true],
      ...(showAll
        ? ([
            
            ["Gemini 1.5 Flash", "gemini-1.5-flash", true, true, false],
          ] as ModelInfo[])
        : []),
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
              <span className="flex-1 text-left">{model[0]}</span>
              <div className="flex items-center gap-1">
                {model[2] && (
                  <i className="bi bi-eye text-xs text-blue-400" title="Supports images"></i>
                )}
                {model[3] && (
                  <i
                    className="bi bi-file-earmark-text text-xs text-green-400"
                    title="Supports documents"
                  ></i>
                )}
                {model[4] && (
                  <i className="bi bi-search text-xs text-blue-400" title="Supports search"></i>
                )}
              </div>
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
