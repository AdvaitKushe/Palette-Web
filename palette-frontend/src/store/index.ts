import { atom,  } from "jotai";

import { type Message, type NoteInfo, type User, type userInput } from '../../shared/model';
import { addDoc, collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../firebase/fire";
import { deleteCollection } from "../firebase/crud";
import { debounce } from "lodash";

const notesAtomAsync = atom<NoteInfo[]>([])


export const notesAtom = atom(
  (get) => get(notesAtomAsync),
  // @ts-ignore
  (get, set, newNotes: NoteInfo[]) => set(notesAtomAsync, newNotes)
)

export const streamedResponseAtom = atom<string>('')

export const tokenAtom = atom<string | null>(null)

export const currImageArrayAtom = atom<{imageData: ArrayBuffer | string | null, name: string}[]>([])

export const userAtom = atom<User | null>(null)

export const isSearchOpenAtom = atom<boolean>(false)

export const messageAtom = atom<string>('New Note')

export const userIDAtom = atom<string | null>(null)

export const selectedNoteIndexAtom = atom<number | null>(null)

export const selectedModelAtom = atom(['OpenAI', 'gpt-4.1', 'OpenAI GPT-4.1'])

export const isWaitingForResponseAtom = atom<boolean>(false)

export const modelSearchCapabilityAtom = atom<boolean>(false)

export const searchEnabledAtom = atom<boolean>(false)



export const deleteNoteAtom = atom(null, async (get, set, index: number) => {
  const userId = get(userIDAtom)
  const notes = get(notesAtom)

  if (index === null || !notes) return

  if (index != null && userId != null && notes[index].key) {
    
    await deleteCollection(notes[index].key, userId)
  }
  

  set(notesAtom, notes.filter((_, i) => i !== index))
  set(selectedNoteIndexAtom, null)
})


export const createNewNoteAtom = atom(
  null,
  async (get, set, title: string, userInput: userInput) => {
    const notes = await get(notesAtomAsync)
    const model = get(selectedModelAtom)
    const userId = get(userIDAtom)
    const currImageArray = get(currImageArrayAtom)
    set(streamedResponseAtom, 'Thinking of a response...')
    
    let newNote: NoteInfo = {
      title: title,
      uid: notes.length + 1,
      lastEditTime: Date.now(),
      key: '',
      messages: [{
        conversation: {
          prompt: userInput.prompt,
          company: model[0],
          model: model[1],
          response: 'Thinking of a response...',
          files: currImageArray.map((image) => image.imageData)
        }
      }]
    }

    // Create document with initial state
    const docRef = collection(db, "users/" + userId + "/chats")
    const res = await addDoc(docRef, newNote)
    
    // Update with document key
    newNote = { ...newNote, key: res.id }
    
    // Update UI immediately
    set(notesAtom, [newNote, ...notes])
    set(selectedNoteIndexAtom, 0)

    let fullResponse = '';

    // Web-compatible streaming
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: userInput.prompt,
          company: model[0],
          model: model[1],
          id: userId,
          context: [],
          files: currImageArray,
          search: get(searchEnabledAtom)
        })
      });

      const reader = response.body?.getReader();
      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          const chunk = new TextDecoder().decode(value);
          fullResponse += chunk;
          set(streamedResponseAtom, fullResponse);
        }
      }
      
      set(isWaitingForResponseAtom, false);
    } catch (error) {
      console.error('Error in stream:', error);
      set(isWaitingForResponseAtom, false);
    }
    
    set(currImageArrayAtom, [])
    
    // Update the message with actual response
    const updatedMessages = [{
      conversation: {
        prompt: userInput.prompt,
        company: model[0],
        model: model[1],
        response: fullResponse,
        files: currImageArray.map((image) => image.imageData)
      }
    }]

    // Update both database and UI
    await updateDoc(doc(db, "users/" + userId + "/chats/" + res.id), {
      messages: updatedMessages,
      lastEditTime: Date.now()
    })

    set(notesAtom, [
      { ...newNote, messages: updatedMessages, lastEditTime: Date.now() },
      ...notes.slice(1)
    ])
  }
)


export const addMessageAtom = atom(
  null,
  async (get, set, message: string) => {
    const notes = await get(notesAtomAsync)
    const model = get(selectedModelAtom)
    const userId = get(userIDAtom)
    const selectedNoteIndex = get(selectedNoteIndexAtom)
    const currImageArray = get(currImageArrayAtom)
    set(streamedResponseAtom, 'Thinking of a response...')
    if (selectedNoteIndex == null || !userId) return
    
    const currentNote = notes[selectedNoteIndex]
    const docRef = doc(db, "users/" + userId + "/chats/" + currentNote.key)
    
    const newMessage: Message = {
      conversation: {
        prompt: message,
        company: model[0],
        model: model[1],
        response: 'Thinking of a response...',
        files: currImageArray.map((image) => image.imageData)
      }
    }
    
    // Batch updates to reduce renders
    const updatedMessages = [...(currentNote.messages || []), newMessage]
    const updatedNote = {
      ...currentNote,
      messages: updatedMessages,
      lastEditTime: Date.now()

    }
    
    // Update database and state in parallel
    await Promise.all([
      updateDoc(docRef, {
        messages: updatedMessages,
        lastEditTime: updatedNote.lastEditTime
      }),
      set(notesAtom, notes.map((note, i) => 
        i === selectedNoteIndex ? updatedNote : note
      ))
    ])

    // Debounce API calls to prevent overwhelming the system
    const debouncedApiCall = debounce(async () => {
      let fullResponse = '';

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/stream`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            prompt: message,
            company: model[0],
            model: model[1],
            search: get(searchEnabledAtom),
            id: userId,
            context: notes[selectedNoteIndex]
              ?.messages
              ?.slice()
              .reverse()
              .map(message => message.conversation)
              .map(msg => msg && ({
                prompt: msg.prompt,
                response: msg.response
              }))
              .filter((msg): msg is {prompt: string, response: string} => msg !== null),
            files: currImageArray
          })
        });

        const reader = response.body?.getReader();
        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            
            const chunk = new TextDecoder().decode(value);
            fullResponse += chunk;
            set(streamedResponseAtom, fullResponse);
          }
        }
        
        set(isWaitingForResponseAtom, false);
      } catch (error) {
        console.error('Error in stream:', error);
        set(isWaitingForResponseAtom, false);
      }

      const updatedMessage = {
        conversation: {
          ...newMessage.conversation,
          response: fullResponse
        }
      }
      
      const finalMessages = [...updatedMessages.slice(0, -1), updatedMessage]
      
      // Batch final updates
      await Promise.all([
        updateDoc(docRef, { 
          messages: finalMessages,
          lastEditTime: Date.now()
        }),
        set(notesAtom, notes.map((note, i) => 
          i === selectedNoteIndex 
            ? { ...note, messages: finalMessages, lastEditTime: Date.now() }
            : note
        ))
      ])
    }, 300) // 300ms delay
    set(streamedResponseAtom, 'Thinking of a response...')
    debouncedApiCall()

  }
)

export const loadNotesAtom = atom(
  null,
  async (get, set) => {
    const userId = get(userIDAtom)
    if (!userId) return
    
    const docRef = collection(db, "users/" + userId + "/chats")
    const res = await getDocs(docRef)
    
    // Process data in a single pass instead of multiple operations
    const notes: NoteInfo[] = res.docs.reduce((acc, doc) => {
      const data = doc.data();
      if (data) {
        acc.push({
          ...data,
          key: doc.id,
          uid: data.uid || 0,
          title: data.title || '',
          lastEditTime: data.lastEditTime || Date.now(),
          messages: data.messages || []
        } as NoteInfo);
      }
      return acc;
    }, [] as NoteInfo[]);
    
    // Sort once at the end
    notes.sort((a, b) => b.lastEditTime - a.lastEditTime);
    set(notesAtom, notes)
  }
)