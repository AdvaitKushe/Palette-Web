import { type ComponentProps, useEffect, useRef, useMemo } from 'react'

import { useNotesList } from '../hooks/useNotesList'


import { PromptResponse } from '../components/PromptResponse'
import { ChatResponse } from '../components/ChatResponse'
import { isWaitingForResponseAtom } from '../store'
import { useAtomValue } from 'jotai'
export const GeneratedChat = ({ className, ...props }: ComponentProps<'div'>) => {
  const contentRef = useRef<HTMLDivElement>(null)
  const { notes, selectedNoteIndex } = useNotesList({
    onSelect: () => {
      scrollToBottom()
    }
  })
  const isWaitingForResponse = useAtomValue(isWaitingForResponseAtom)

  const scrollToBottom = () => {
    if (contentRef.current) {
      contentRef.current.scrollTo({
        top: contentRef.current.scrollHeight,
        behavior: 'smooth'
      })
    }
  }

  // Scroll when messages change or during typing
  useEffect(() => {
    scrollToBottom()
  }, [notes, isWaitingForResponse])

  // Memoize the messages for the selected note
  const selectedMessages = useMemo(() => {
    return selectedNoteIndex != null ? notes?.[selectedNoteIndex]?.messages : null
  }, [notes, selectedNoteIndex])

  return (
    <div {...props} ref={contentRef} className="flex-1 overflow-y-auto pb-[50px]">
      <div className="flex flex-col">
        {selectedMessages?.map((thread, index) => (
          console.log("selectedMessages", selectedMessages),
          <div
            key={index} // Use a stable ID if available
            className="flex flex-col whitespace-pre-wrap break-words overflow-x-hidden max-w-full"
          >
            <PromptResponse message={thread} />
            <ChatResponse
              typed={index === selectedMessages.length - 1 ? isWaitingForResponse : false}
              message={thread}
            />
           
            
          </div>
        ))}
      </div>
    </div>
  )
}
