import { type ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'
import { NewChat } from './buttons/NewChat'
export const SideBarActionRow = ({ children, className, ...props }: ComponentProps<'div'>) => {
  return (
    <div
      className={twMerge(
        'flex flex-row items-centertop-0  overflow-hidden mb-4 bg-red-900/50',
        className
      )}
      {...props}
    >
      <NewChat className="w-full  " />
    </div>
  )
}
