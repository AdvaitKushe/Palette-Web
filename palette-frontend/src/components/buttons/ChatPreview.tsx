import { useState, useRef, useEffect } from 'react'
import { type ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'
import { OptionsButton } from './SingleChatOptions'
import { useAtom } from 'jotai'
import { notesAtom, userIDAtom } from '../../store'
import { updateCollection } from '../../firebase/crud'
export const ChatPreview = ({
  className,
  isActive,
  title,
  index,
  onClick,
  ...props
}: ComponentProps<'div'> & {
  isActive?: boolean
  title: string
  index: number
  onClick?: () => void
}) => {
  const [, setIsOptionsOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editedTitle, setEditedTitle] = useState(title)
  const [notes, setNotes] = useAtom(notesAtom)
  const inputRef = useRef<HTMLInputElement>(null)
  const [userId] = useAtom(userIDAtom)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isEditing])

  const handleRename = () => {
    const updatedNotes = [...notes]
    updatedNotes[index] = {
      ...updatedNotes[index],
      title: editedTitle
    }
    updateCollection(`users/${userId}/chats/${updatedNotes[index].key}`, { title: editedTitle })
    setNotes(updatedNotes)
    setIsEditing(false)
  }

  return (
    <div
      className={twMerge(
        'group flex items-center px-2 py-2 text-sm rounded-md text-zinc-400 hover:bg-zinc-500/30 hover:text-white transition-all duration-200 w-full whitespace-nowrap',
        isActive && 'bg-zinc-500/50 text-white',
        className
      )}
      onClick={onClick}
      {...props}
    >
      {isEditing ? (
        <input
          ref={inputRef}
          className="flex-1 bg-transparent outline-none"
          value={editedTitle}
          onChange={(e) => setEditedTitle(e.target.value)}
          onBlur={handleRename}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleRename()
            }
          }}
        />
      ) : (
        <span className="flex-1 truncate">{title}</span>
      )}
      <OptionsButton
        className="ml-auto"
        isOptionsOpen={setIsOptionsOpen}
        index={index}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
      />
    </div>
  )
}
