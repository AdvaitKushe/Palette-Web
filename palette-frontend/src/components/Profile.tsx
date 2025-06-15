import { type ComponentProps, useRef, useState } from 'react'
import { DropDown } from './DropDowns'
import { twMerge } from 'tailwind-merge'
import { tokenAtom, userAtom } from '../store'
import { useAtom } from 'jotai'
//import { Billing } from './Billing'

export const Profile = ({ className }: ComponentProps<'div'>) => {
  const buttonRef = useRef<HTMLDivElement>(null)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [user, setUser] = useAtom(userAtom)

  const [, setToken] = useAtom(tokenAtom)

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

  const onSignOut = () => {
    console.log('Signing out')
    setToken(null)
    setUser(null)
  }

  const profileImage = user?.picture || '/default-avatar.png'

  return (
    <div
      ref={buttonRef}
      className={twMerge('profile-button-container align-middle z-10 ', className)}
    >
      <button className="profile-button cursor-pointer  " onClick={toggleDropdown}>
        <img
          src={profileImage}
          alt="Profile"
          className="profile-image rounded-full w-8 h-8"
          onError={() => {
            //e.currentTarget.src = '/default-avatar.png'
            //setImageError(true)
          }}
        />
      </button>

      {isDropdownOpen && (
        <DropDown
          className="mt-2 ml-2 bg-zinc-900/60  w-20 -translate-x-8 mt-3"
          buttonRef={buttonRef as React.RefObject<HTMLElement>}
          onClose={toggleDropdown}
        >
          <button className="flex items-center justify-center w-full text-sm hover:bg-zinc-600/50 transition-all duration-300 rounded-md" onClick={onSignOut}>
            Sign Out
          </button> 
          {/* <Billing className= " transition-all duration-300 hover:bg-zinc-600/50 rounded-md" /> */}
        </DropDown>
           
      )}
    </div>
  )
}
