export interface NoteInfo {
    title: string
    uid: number
    lastEditTime: number
    key?: string
    content?: string
    messages?: Array<Message>
  }

  export interface User {
    id: string
    email: string
    name: string
    picture: string
    subscription: boolean
  }
  
  export type NoteContent = string

  export interface Message {
    conversation: {
      prompt: string
      company: string
      model: string
      response: string
      files: Array<string | ArrayBuffer | null>
    }
  }

  export interface userInput {
    prompt: string
    company: string
    model: string
    id?: string | null
  }

  