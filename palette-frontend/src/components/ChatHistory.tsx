import { type ComponentProps } from "react";
import { twMerge } from "tailwind-merge";
import { ChatPreview } from "./buttons/ChatPreview";
import { useNotesList } from "../hooks/useNotesList";
import { isEmpty } from "lodash";

export const ChatHistory = ({
  className,
  contentRef,
  onSelect,
  ...props
}: ComponentProps<"ul"> & {
  onSelect?: () => void;
  contentRef?: React.RefObject<HTMLDivElement>;
}) => {
  const { notes, selectedNoteIndex, handleNoteSelect } = useNotesList({
    onSelect: onSelect,
  });

  if (!notes) return null;

  if (isEmpty(notes)) {
    return (
      <ul className={twMerge("text-center pt-4", className)}>
        <span className="text-zinc-400">No notes yet</span>
      </ul>
    );
  }
  return (
    <ul className={twMerge("h-[calc(100vh-50px)] overflow-y-auto", className)} {...props}>
      {notes.map((note, index) => (
        <ChatPreview
          isActive={index === selectedNoteIndex}
          key={index}
          title={note.title}
          onClick={handleNoteSelect(index)}
          index={index}
        />
      ))}
    </ul>
  );
};
