import { type ComponentProps, useState } from 'react'
import { twMerge } from 'tailwind-merge';

export const CopyButtonInChat = ({
  className,
  acceptRef,
  text,
  ...props
}: { className?: string; acceptRef?: React.RefObject<HTMLDivElement>; text?: string } & ComponentProps<'div'>) => {
  const [copied, setCopied] = useState(false)
  const [copiedText, setCopiedText] = useState('')

  const handleCopy = () => {
    if (acceptRef) {
      const textToCopy = acceptRef.current?.textContent || ''
      navigator.clipboard.writeText(textToCopy)
      setCopied(true)
      setCopiedText(textToCopy)
      setTimeout(() => setCopied(false), 2000)
    } else if (text) {
      navigator.clipboard.writeText(text)
      setCopied(true)
      setCopiedText(text)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div
      className={twMerge("item-start cursor-pointer transition-opacity text-xs", className)}
      onClick={() => handleCopy()}
      {...props}
    >
      {copied && (copiedText === acceptRef?.current?.textContent || copiedText === text) ? 'copied!' : 'copy'}
    </div>
  )
}
