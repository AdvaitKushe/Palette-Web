import { type ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'

export const Option = ({ className, children, onClick, ...props }: ComponentProps<'div'>) => {
  return (
    <div
      className={twMerge(
        'px-4 py-2 hover:bg-zinc-700 rounded-lg cursor-pointer text-white/70 hover:text-white text-sm',
        className
      )}
      onClick={(e) => {
        e.stopPropagation()
        onClick?.(e)
        console.log('Option clicked') // Debug log
      }}
      {...props}
    >
      {children}
    </div>
  )
}
