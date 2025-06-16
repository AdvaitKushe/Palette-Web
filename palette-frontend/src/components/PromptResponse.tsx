import { type Message } from "../../shared/model";
import { twMerge } from "tailwind-merge";
import { CopyButtonInChat } from "./buttons/CopyButtonInChat";
import { type ComponentProps, useRef } from "react";

const FileRenderer = ({ file, name }: { file: string | ArrayBuffer | null; name: string }) => {
  if (!file) return null;

  const fileUrl = typeof file === "string" ? file : URL.createObjectURL(new Blob([file]));
  const isImage = typeof file === "string" && file.startsWith("data:image");

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="relative group cursor-pointer" onClick={handleDownload}>
      {isImage ? (
        <img
          src={fileUrl}
          alt={name}
          className="max-w-[200px] max-h-[200px] object-contain rounded-lg"
        />
      ) : (
        <div className="flex items-center gap-2 bg-zinc-800/50 p-2 rounded-lg">
          <div className="h-8 w-8 bg-zinc-700 rounded flex items-center justify-center">
            <i className="bi bi-file-earmark text-lg"></i>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium">{name}</span>
            <span className="text-xs text-zinc-400">FILE</span>
          </div>
        </div>
      )}
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
        <i className="bi bi-download text-white text-xl"></i>
      </div>
    </div>
  );
};

export const PromptResponse = ({
  className,
  message,
}: { message: Message } & ComponentProps<"div">) => {
  const ref = useRef<HTMLDivElement>(null);

  // Check if the message contains any files
  const hasFiles = message.conversation.files && message.conversation.files.length > 0;

  return (
    <div className={twMerge("flex flex-col items-end w-full", className)}>
      <div className="group items-end self-end">
        <CopyButtonInChat
          className="w-fit text-gray-500 hover:bg-zinc-500/50 rounded-md px-1 py-0.5 cursor-pointer transition-opacity text-xs opacity-0 group-hover:opacity-100"
          acceptRef={ref as React.RefObject<HTMLDivElement>}
        />
        <div className="flex flex-col bg-zinc-900/50 rounded-md p-3 w-fit max-w-[500px]">
          <span ref={ref} className="text-sm">
            {message.conversation.prompt}
          </span>
          {hasFiles && (
            <div className="flex flex-wrap gap-2 mt-2">
              {message.conversation.files.map(
                (file, index) =>
                  file && <FileRenderer key={index} file={file} name={`file-${index}`} />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
