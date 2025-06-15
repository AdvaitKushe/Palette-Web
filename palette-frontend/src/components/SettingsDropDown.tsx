import { type ComponentProps, useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

export const SettingsDropdown = ({
  className,
  openai,
  gemini,
  anthropic,
  onSettingsChange,
  ...props
}: ComponentProps<"div"> & {
  openai: string;
  gemini: string;
  anthropic: string;
  onSettingsChange: (value: string[]) => void;
}) => {
  const [openaiKey, setOpenaiKey] = useState(openai);
  const [geminiKey, setGeminiKey] = useState(gemini);
  const [anthropicKey, setAnthropicKey] = useState(anthropic);
  const [showOpenai, setShowOpenai] = useState(false);
  const [showGemini, setShowGemini] = useState(false);
  const [showAnthopic, setShowAnthropic] = useState(false);

  useEffect(() => {
    onSettingsChange([openaiKey, geminiKey, anthropicKey]);
    console.log(openaiKey, geminiKey, anthropicKey);
  }, [openaiKey, geminiKey, anthropicKey]);

  return (
    <div
      className={twMerge(
        "flex flex-col items-center justify-center bg-zinc-900/95 rounded-lg p-2 shadow-lg w-full ",
        className
      )}
      {...props}
    >
      <div className="flex flex-col gap-2 w-full">
        <div className="flex items-center gap-2">
          <i
            className="bi bi-info-circle text-zinc-400 cursor-pointer"
            onClick={() => window.open("https://platform.openai.com/docs/quickstart", "_blank")}
          ></i>
          <div className="text-sm flex-shrink-0 text-right">OpenAI API Key:</div>
          <div className="relative flex-1">
            <input
              className="bg-zinc-800/30 rounded-md p-2 w-full text-white outline-none w-[198px]"
              type={showOpenai ? "text" : "password"}
              value={openaiKey}
              onChange={(e) => setOpenaiKey(e.target.value)}
            />
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2"
              onClick={() => setShowOpenai(!showOpenai)}
            >
              <i className={`bi bi-eye${showOpenai ? "" : "-slash"}`}></i>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <i
            className="bi bi-info-circle text-zinc-400 cursor-pointer"
            onClick={() => window.open("https://ai.google.dev/gemini-api/docs/api-key", "_blank")}
          ></i>
          <div className="text-sm flex-shrink-0 text-right">Gemini API Key:</div>
          <div className="relative flex-1">
            <input
              className="bg-zinc-800/30 rounded-md p-2 w-full text-white outline-none w-[198px]"
              type={showGemini ? "text" : "password"}
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
            />
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2"
              onClick={() => setShowGemini(!showGemini)}
            >
              <i className={`bi bi-eye${showGemini ? "" : "-slash"}`}></i>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 ">
          <i
            className="bi bi-info-circle text-zinc-400 cursor-pointer"
            onClick={() =>
              window.open("https://docs.anthropic.com/en/docs/initial-setup", "_blank")
            }
          ></i>
          <div className="text-sm flex-shrink-0 text-right">Anthropic API Key:</div>
          <div className="relative flex-1">
            <input
              className="bg-zinc-800/30 rounded-md p-2 w-full text-white outline-none w-[198px]"
              type={showAnthopic ? "text" : "password"}
              value={anthropicKey}
              onChange={(e) => setAnthropicKey(e.target.value)}
            />
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2"
              onClick={() => setShowAnthropic(!showAnthopic)}
            >
              <i className={`bi bi-eye${showAnthopic ? "" : "-slash"}`}></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
