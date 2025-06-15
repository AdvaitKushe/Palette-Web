import { type ComponentProps, memo, useRef } from "react";
import { twMerge } from "tailwind-merge";
import { type Message } from "../../shared/model";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
//import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { CopyButtonInChat } from "./buttons/CopyButtonInChat";
import { materialDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useAtomValue } from "jotai";
import { streamedResponseAtom } from "../store";
import TableEditor from "./TableEditor";
import remarkGfm from "remark-gfm";

const CodeBlockAlt = memo(({ code }: { code: string }) => {
  return (
    <div className="flex flex-col relative group">
      <CopyButtonInChat
        className="w-fit ml-1 
          
          rounded-md px-1 py-0.5 
          cursor-pointer 
          transition-all duration-200 
          text-xs"
        text={code}
      />

      <SyntaxHighlighter
        className="bg-zinc-800/40 rounded-lg overflow-y-auto"
        language="python"
        wrapLongLines={true}
        style={materialDark}
        customStyle={{
          margin: 0,
          padding: "1rem",
          textShadow: "none",
          whiteSpace: "pre-wrap",
          wordWrap: "break-word",
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
});

export const ChatResponse = ({
  className,
  message,
  typed,
}: { className?: string; message: Message; typed: boolean } & ComponentProps<"div">) => {
  const ref = useRef<HTMLDivElement>(null);
  //const { displayedText, isTyping } = useTypewriter(message.conversation.response)
  const currentText = useAtomValue(streamedResponseAtom);

  return (
    <div className={twMerge("flex flex-col mt-1 mb-2", className)}>
      <div className="flex flex-row items-center text-xs text-gray-500 mb-0.5">
        {message.conversation.model}
        <CopyButtonInChat
          className="w-fit ml-1 hover:bg-zinc-900/50 rounded-md px-1 py-0.5 cursor-pointer transition-all duration-200 text-xs"
          text={message.conversation.response}
        />
      </div>
      <div ref={ref}>
        <div
          className="text-sm prose prose-invert max-w-none 
                      prose-pre:bg-transparent prose-code:bg-transparent 
                      prose-pre:shadow-none prose-pre:border-0
                      prose-ul:my-1 prose-ul:pl-4 
                      prose-li:my-0 prose-li:marker:text-gray-400
                      prose-p:my-1 leading-normal
                      [&_p]:leading-normal [&_li]:leading-normal
                      prose-headings:my-2 prose-h1:text-xl prose-h2:text-lg prose-h3:text-base
                      prose-h1:mb-2 prose-h2:mb-2 prose-h3:mb-1
                      prose-ul:list-disc prose-ul:list-inside
                      prose-table:border-collapse prose-table:w-full
                      prose-th:border prose-th:border-zinc-700 prose-th:p-2 prose-th:text-left
                      prose-td:border prose-td:border-zinc-700 prose-td:p-2
                      prose-tr:border-b prose-tr:border-zinc-700
                      prose-thead:bg-zinc-800/50"
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code: ({ children, className }) => {
                const match = /language-(\w+)/.exec(className || "");
                return match ? (
                  <CodeBlockAlt code={String(children)} />
                ) : (
                  <code className="bg-transparent px-1 py-0.5 rounded">{String(children)}</code>
                );
              },
              table: ({  }) => {
                try {
                  // Extract the raw markdown from the message
                  const rawMarkdown = typed ? currentText : String(message.conversation.response);

                  // Find all markdown tables in the content
                  // A table is defined as consecutive lines starting and ending with |, with at least one separator row
                  const tableBlockRegex = /((?:^\|.*\|\s*$\n?)+)/gm;
                  const matches = rawMarkdown.match(tableBlockRegex);
                  if (!matches || matches.length === 0) {
                    return <div>No table found in the content</div>;
                  }
                  // Use the first table found
                  let tableContent = matches[0].trim();

                  // Remove duplicate separator rows (|---|...|)
                  const lines = tableContent.split("\n").filter(Boolean);
                  let foundSeparator = false;
                  const filteredLines = lines.filter((line) => {
                    if (/^\|\s*(:?-+:?\s*\|)+\s*$/.test(line)) {
                      if (foundSeparator) return false;
                      foundSeparator = true;
                      return true;
                    }
                    return true;
                  });
                  if (filteredLines.length < 2) {
                    return <div>Invalid table format</div>;
                  }
                  tableContent = filteredLines.join("\n");

                  return <TableEditor initialMarkdown={tableContent} />;
                } catch (error) {
                  console.error("Error processing table:", error);
                  return <div>Error processing table</div>;
                }
              },
            }}
          >
            {typed ? currentText : String(message.conversation.response)}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};
