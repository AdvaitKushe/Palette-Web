import { useState } from 'react'
import { type ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'

export default function ModelChoice({
  company,
  children,
  className,
  onModelSelect,
  ...props
}: {
  company: string
  children: string[][]
  onModelSelect: (model: string[], company: string) => void
} & ComponentProps<'div'>) {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <div className={twMerge('relative', className)} {...props}>
      <div
        className={twMerge(
          'w-full flex flex-row items-center justify-between px-2 py-2 rounded-md hover:bg-white/10 transition-all duration-300 active:scale-95 border-r border-transparent hover:border-white/20',
          isOpen ? 'bg-zinc-600/40 text-white border-r border-white/20' : ''
        )}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <span className="flex-grow text-center">{company}</span>
        <i className="bi bi-arrow-right-short"></i>
      </div>

      {isOpen && (
        <>
          <div
            className="absolute left-full top-0 w-2 h-full"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
          />
          <div
            className="absolute left-full top-0 ml-2 bg-zinc-900/95 min-w-[200px] rounded-md shadow-lg"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
          >
            {children.map((child, index) => (
              <div
                key={index}
                className="w-full rounded-md px-4 py-2  cursor-pointer transition-all duration-200 flex items-center justify-between"
                onClick={() => {
                  onModelSelect(child, company)
                }}
              >
                <div className="flex flex-row items-center justify-center hover:bg-white/10 rounded-md px-1 py-1 text-sm w-full">
                  {child[0]}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
