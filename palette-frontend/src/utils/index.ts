import { type userInput } from '../../shared/model'
// @ts-ignore


export const handleKeyDown = (
  e: React.KeyboardEvent<HTMLTextAreaElement>, 
  sendFunction: (...args: any[]) => void, 
  
  setRows: React.Dispatch<React.SetStateAction<number>>, 
  MAX_ROWS: number,
  inputRef?: React.RefObject<HTMLTextAreaElement>,

) => {
  const adjustHeight = (textarea: HTMLTextAreaElement) => {
    textarea.style.height = '10px'
    const newHeight = Math.min(textarea.scrollHeight, MAX_ROWS * 24)
    textarea.style.height = `${newHeight}px`
  }

  if ((e.key === 'Enter' && !e.shiftKey)) {
    e.preventDefault()
    
    if (inputRef?.current && inputRef?.current?.value !== '') {
        sendFunction(inputRef)
        inputRef.current.value = ''
    }
  }
  
  if (e.key === 'Enter' && e.shiftKey) {
    e.preventDefault()
    const textarea = e.currentTarget
    const cursorPosition = textarea.selectionStart
    const textBeforeCursor = textarea.value.substring(0, cursorPosition)
    const textAfterCursor = textarea.value.substring(cursorPosition)
    
    textarea.value = textBeforeCursor + '\n' + textAfterCursor
    textarea.selectionStart = textarea.selectionEnd = cursorPosition + 1
    
    setRows((prev) => Math.min(prev + 1, MAX_ROWS))
    adjustHeight(textarea)
    
    // Only scroll if cursor is near the bottom
    const isNearBottom = textarea.scrollHeight - textarea.scrollTop - textarea.clientHeight < 50
    if (isNearBottom) {
      textarea.scrollTo({
        top: textarea.scrollHeight,
        behavior: 'smooth'
      })
    }
  }

  if (e.key === 'Backspace' && e.currentTarget.value.endsWith('\n')) {
    setRows((prev) => Math.max(1, prev - 1))
    adjustHeight(e.currentTarget)
  }

  // Call adjustHeight on any key press
  adjustHeight(e.currentTarget)
}


export const sendFunction = (
  setIsWaitingForResponse: React.Dispatch<React.SetStateAction<boolean>>,
  createNewNote: (message: string, sendAMessage: userInput) => void,
  addMessage: (message: string) => void,
  message: string,
  selectedNoteIndex: number | null,
  _setMessage: React.Dispatch<React.SetStateAction<string>>,
  _setCurrImageArray: React.Dispatch<React.SetStateAction<{imageData: ArrayBuffer | string | null, name: string}[]>>,
  contentRef: React.RefObject<HTMLDivElement> | undefined,
  model: string[],
  _userId: string | null,
  
) => {
  return async () => {
    setIsWaitingForResponse(true)
    
    if (!message.trim()) {
      setIsWaitingForResponse(false)
      return
    }
    

     selectedNoteIndex == null
      ?  createNewNote(message, {
          prompt: message,
          company: model[0],
          model: model[1],
       
        })
      : addMessage(message)
    
    //setCurrImageArray([])

    if (contentRef?.current) {
      contentRef.current.scrollTo({
        top: contentRef.current.scrollHeight,
        behavior: 'smooth'
      })
      console.log("contentRef?.current", contentRef?.current)
    }
  }
}