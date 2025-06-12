import { type ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'
import { ActionButton } from './ActionButton'

export const SendChat = ({ className, ...props }: ComponentProps<'button'>) => {
  return (
    <ActionButton
      className={twMerge(
        'bg-zinc-800 border rounded-[20px] border-zinc-400/50 flex-shrink-0 absolute top-0 bottom-0 right-0 ml-1 border-r-0 m-[2px]',
        className
      )}
      {...props}
    >
      <i className="bi bi-send"></i>
    </ActionButton>
  )
}
