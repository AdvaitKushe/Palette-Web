import { twMerge } from 'tailwind-merge'
import { currImageArrayAtom } from '../../store'
import { useAtom } from 'jotai'

export const FileButton = ({
  className,
  img,
  name
}: {
  className?: string
  img: string | ArrayBuffer | null
  name: string
}) => {
  const [currImageArray, setCurrImageArray] = useAtom(currImageArrayAtom)
  const imgSrc = typeof img === 'string' ? img : ''

  return (
    <div
      className={twMerge(
        'bg-zinc-900/70 text-sm border border-white/20 h-5 w-21 flex items-center justify-between pl-2 pr-2 m-1 hover:bg-zinc-900/20 transition-all duration-300 cursor-pointer z-100',
        className
      )}
    >
      <span className="truncate max-w-[72px] inline-block">{name}</span>

      <div
        className="flex items-center hover:bg-zinc-900/20 transition-all duration-300 cursor-pointer rounded-full"
        onClick={() => {
          setCurrImageArray((prevArray) => prevArray.filter((image) => image.imageData !== img))
        }}
      >
        <i className="bi bi-x text-xs"></i>
      </div>
    </div>
  )
}
