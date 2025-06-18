import { notesAtom, selectedNoteIndexAtom, isWaitingForResponseAtom, searchEnabledAtom,  } from '../store'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'

export const useNotesList = ({ onSelect }: { onSelect?: () => void }) => {
  const notes = useAtomValue(notesAtom)

  const [selectedNoteIndex, setSelectedNoteIndex] = useAtom(selectedNoteIndexAtom)
  const setIsWaitingForResponse = useSetAtom(isWaitingForResponseAtom)
  const setSearchEnabled = useSetAtom(searchEnabledAtom)
  //const setCurrImageArray = useSetAtom(currImageArrayAtom)
  //async function to set the selected node index set the value of selectedNoteIndex
  const handleNoteSelect = (index: number | null) => async () => {
    if (onSelect) {
      onSelect()
    }
    if (index === null) {
      setSelectedNoteIndex(null)
      setIsWaitingForResponse(false)
      setSearchEnabled(false)
      if (onSelect) {
        onSelect()
      }
    } else {
      setSelectedNoteIndex(index)
      setIsWaitingForResponse(false)
     // 
    }
  }

  return {
    notes,
    selectedNoteIndex,
    handleNoteSelect
  }
}
