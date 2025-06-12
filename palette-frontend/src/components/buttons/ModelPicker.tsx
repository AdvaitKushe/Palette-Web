import { type ComponentProps, useState, useEffect, useRef } from 'react'
import { twMerge } from 'tailwind-merge'
import { ActionButton } from './ActionButton'
import { ModelDropdown } from './ModelDropdown'
import { useAtom } from 'jotai'
import { selectedModelAtom } from '../../store'

export const ModelPicker = ({ className, ...props }: ComponentProps<'div'>) => {
  const [model, setModel] = useAtom(selectedModelAtom)
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleModelSelect = (model: string[], company: string) => {
    // model[0] is the model name, model[1] is the model id
    setModel([company, model[1], `${company} ${model[0]}`])

    setIsOpen(false)
  }

  return (
    <div
      ref={dropdownRef}
      className={twMerge('flex flex-col items-center justify-center z-50 relative', className)}
      {...props}
    >
      <ActionButton
        className={twMerge(
          'flex flex-row items-center justify-center',
          isOpen ? 'bg-zinc-600/50 text-white' : ''
        )}
        onClick={() => {
          setIsOpen(!isOpen)
        }}
      >
        <div className="flex flex-row items-left justify-center">{model[2]}</div>
        <i className="ml-2 bi bi-chevron-down flex items-center"></i>
      </ActionButton>
      {isOpen && <ModelDropdown className="" onModelSelect={handleModelSelect} />}
    </div>
  )
}
