import { type Message } from "../../shared/model"
import { twMerge } from "tailwind-merge"
import { CopyButtonInChat } from "./buttons/CopyButtonInChat"
import { type ComponentProps, useRef } from "react"
export const PromptResponse = ({ className, message }: {message: Message } & ComponentProps<'div'>) => {
    const ref = useRef<HTMLDivElement>(null)
    return (

        <div className={twMerge("flex flex-col items-end w-full", className)}>
        <div className="group items-end self-end">
          <CopyButtonInChat
            className="w-fit text-gray-500 hover:bg-zinc-500/50 rounded-md px-1 py-0.5  cursor-pointer transition-opacity text-xs opacity-0 group-hover:opacity-100"
            
            acceptRef={ref as React.RefObject<HTMLDivElement>}
          />
          <div className="flex flex-col bg-zinc-900/50 rounded-md p-3 w-fit max-w-[500px]">
            <span ref={ref} className="text-sm">{message.conversation.prompt}</span>
          </div>
        </div>
      </div>
    )
}