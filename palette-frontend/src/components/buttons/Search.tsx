import { type ComponentProps } from 'react'

import { twMerge } from 'tailwind-merge'
import { ActionButton } from './ActionButton'
import { useAtom } from 'jotai'
import { isSearchOpenAtom } from '../../store'

export const Search = ({ className, ...props }: ComponentProps<'button'>) => {
  const [isSearchOpen, setIsSearchOpen] = useAtom(isSearchOpenAtom)

  return (
    <ActionButton
      className={twMerge('flex flex-row items-center justify-center mr-1', className)}
      onClick={() => {
        setIsSearchOpen(!isSearchOpen)
        console.log('isSearchOpen', isSearchOpen)
      }}
      {...props}
    >
      <i className="bi bi-search"></i>
    </ActionButton>
  )
}
