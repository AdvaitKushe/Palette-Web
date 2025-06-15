import { type ComponentProps, useState } from "react";
import { useSetAtom, useAtom } from "jotai";
import {
  createNewNoteAtom,
  selectedModelAtom,
  addMessageAtom,
  messageAtom,
  isWaitingForResponseAtom,
  currImageArrayAtom,
  userIDAtom,
} from "../store/index";
import { useNotesList } from "../hooks/useNotesList";
import { ChatBox } from "./ChatBox";
import { NewNotePage } from "../pages/NewNotePage";
import { sendFunction } from "../utils/index";
export const UserInputArea = ({
  contentRef,
}: ComponentProps<"div"> & { contentRef?: React.RefObject<HTMLDivElement> }) => {
  const [, setRows] = useState(1);
  const MAX_ROWS = 7;
  const createNewNote = useSetAtom(createNewNoteAtom);
  const addMessage = useSetAtom(addMessageAtom);
  const setIsWaitingForResponse = useSetAtom(isWaitingForResponseAtom);
  const [message, setMessage] = useAtom(messageAtom);
  const [, setCurrImageArray] = useAtom(currImageArrayAtom);
  const { selectedNoteIndex } = useNotesList({});

  const [model] = useAtom(selectedModelAtom);
  const [userId] = useAtom(userIDAtom);

  const sendFunc = sendFunction(
    setIsWaitingForResponse,
    createNewNote,
    addMessage,
    message,
    selectedNoteIndex,
    setMessage,
    setCurrImageArray,
    contentRef,
    model,
    userId
  );

  return selectedNoteIndex != null ? (
    <div className="w-full bg-transparent">
      <ChatBox
        sendFunction={sendFunc}
        setRows={setRows}
        MAX_ROWS={MAX_ROWS}
        setMessage={setMessage}
      />
    </div>
  ) : (
    <div className="w-full mb-[40%] ml-[10%]">
      <NewNotePage
        sendFunction={sendFunc}
        setRows={setRows}
        MAX_ROWS={MAX_ROWS}
        setMessage={setMessage}
      />
    </div>
  );
};
