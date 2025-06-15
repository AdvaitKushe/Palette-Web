import { type ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'
import { ActionButton } from './ActionButton'
import { useNotesList } from '../../hooks/useNotesList'

export const NewChat = ({ className, ...props }: ComponentProps<'button'>) => {
  const { handleNoteSelect } = useNotesList({
    onSelect: () => {
      console.log('note selected')
    }
  })
  return (
    <ActionButton className={twMerge('flex flex-row items-center justify-center border-none', className)} onClick={handleNoteSelect(null)} {...props}>
      New Chat
    </ActionButton>
  )
}
