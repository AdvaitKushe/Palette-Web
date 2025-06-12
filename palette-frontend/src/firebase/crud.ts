import { addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc } from "firebase/firestore";
import { db } from "./fire";

interface Todo {
  id: string
  title: string
  description: string
}

export const createCollection = async (collectionName: string, data: any) => {
  try {
    const docRef = collection(db, collectionName);
    const res = await addDoc(docRef, data);
    return { res, status: 200 };
  } catch (error) {
    return error;
  }
};

export const updateCollection = async (path: string, data: any) => {
  try {
    const docRef = doc(db, path)
    const res = await updateDoc(docRef, data);
    return { res, status: 200 };
  } catch (error) {
    return error;
  }
};

export const deleteCollection = async (noteId: string, userId: string) => {
  
  const docRef = doc(db, "users/" + userId + "/chats/" + noteId)
  const res = await deleteDoc(docRef);

  return { res, status: 200 };
};

export const getAllTodo = async (): Promise<{ todos: Todo[], status: number }> => {
  try {
    const todosCol = collection(db, "todo");
    const q = query(todosCol);
    const querySnapshot = await getDocs(q);

    const todos: Todo[] = [];
    querySnapshot.forEach((doc) => {
      todos.push({ id: doc.id, ...doc.data() } as Todo);
    });

    return { todos, status: 200 };
  } catch (error) {
    return { todos: [], status: 500 };
  }
};