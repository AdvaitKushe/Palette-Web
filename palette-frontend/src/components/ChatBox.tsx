import { handleKeyDown } from "../utils";
import { DragAndDrop } from "./buttons/DragAndDrop";
import { SendChat } from "./buttons/SendChat";
import { type ComponentProps, useCallback, useRef } from "react";
import { useDropzone } from "react-dropzone";
import {
  currImageArrayAtom,
  selectedModelAtom,
  modelSearchCapabilityAtom,
  searchEnabledAtom,
} from "../store";
import { useAtom } from "jotai";
import { FileButton } from "./buttons/FileButton";
import { SearchButton } from "./buttons/SearchButton";

export const ChatBox = ({
  className,
  sendFunction,
  setRows,
  MAX_ROWS,
  setMessage,
  ...props
}: ComponentProps<"div"> & {
  sendFunction: (inputRef: React.RefObject<HTMLTextAreaElement>) => void;
  setRows: React.Dispatch<React.SetStateAction<number>>;
  MAX_ROWS: number;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [currImageArray, setCurrImageArray] = useAtom(currImageArrayAtom);
  const [model] = useAtom(selectedModelAtom);
  const [searchCapability] = useAtom(modelSearchCapabilityAtom);
  const [searchEnabled] = useAtom(searchEnabledAtom);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (currImageArray.length >= 1 || acceptedFiles.length > 1) {
        alert("Max one file at a time. File size limit: 4MB");
        return;
      }

      acceptedFiles.forEach((file) => {
        const reader = new FileReader();
        console.log(file.name);

        reader.onabort = () => console.log("file reading was aborted");
        reader.onerror = () => console.log("file reading has failed");
        reader.onload = () => {
          // Convert to base64 string for storing image data
          const base64String = btoa(
            new Uint8Array(reader.result as ArrayBuffer).reduce(
              (data, byte) => data + String.fromCharCode(byte),
              ""
            )
          );
          console.log(file);
          if (file.size < 4000000) {
            const imageData = `data:${file.type};base64,${base64String}`;
            setCurrImageArray((prev) => [...prev, { imageData, name: file.name }]);
          } else {
            alert("File size limit: 4MB");
          }
        };
        reader.readAsArrayBuffer(file);
      });
    },
    [currImageArray]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    noClick: true,
    noKeyboard: true,
    disabled: searchEnabled,
  });

  return (
    <div
      className="flex flex-row relative items-end w-full bg-transparent"
      {...(searchEnabled ? {} : getRootProps())}
      {...props}
    >
      {!searchEnabled && <DragAndDrop {...getInputProps()} />}

      <SendChat onClick={() => sendFunction(inputRef as React.RefObject<HTMLTextAreaElement>)} />

      <div className="border border-zinc-400/50 rounded-[20px] min-h-[100px] w-full overflow-hidden flex">
        <textarea
          ref={inputRef}
          rows={1}
          onKeyDown={(e) =>
            handleKeyDown(
              e,
              () => sendFunction(inputRef as React.RefObject<HTMLTextAreaElement>),
              setRows,
              MAX_ROWS,
              inputRef as React.RefObject<HTMLTextAreaElement>
            )
          }
          className="flex-1 bg-transparent pt-3 pl-3 pr-10 outline-none resize-none whitespace-pre-wrap w-full mb-12"
          onChange={(e) => setMessage(e.currentTarget.value)}
          placeholder={
            model[0] === "OpenAI"
              ? "Please provide a valid OpenAI API key in settings to begin chatting"
              : model[0] === "Anthropic"
              ? "Please provide a valid Anthropic API key in settings to begin chatting"
              : model[0] === "Google"
              ? "Please provide a valid Gemini API key in settings to begin chatting"
              : "Type your message here..."
          }
        />
        <div className="absolute bottom-0 left-10 bottom-1 flex flex-wrap mb-2 ml-2 items-center justify-center gap-2">
          {searchCapability && !searchEnabled && <SearchButton model={model} />}

          {searchEnabled && searchCapability && (
            <div className="absolute  bottom-1 right-[-45px] top-[-28px] ">
              <SearchButton model={model} />
            </div>
          )}

          {!searchEnabled &&
            currImageArray.map((image, index) => (
              <FileButton
                key={index}
                img={{
                  data: image.imageData as string,
                  name: image.name,
                  type: image.name.split(".").pop() || "txt",
                }}
                name={image.name}
                type={image.name.split(".").pop() || "txt"}
              />
            ))}
        </div>
      </div>
    </div>
  );
};
