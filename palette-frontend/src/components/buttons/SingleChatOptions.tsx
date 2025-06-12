import { type ComponentProps, useState, useRef, useEffect } from "react";
import { twMerge } from "tailwind-merge";
import { DropDown } from "./DropDowns";
import { Option } from "./Option";
import { useAtom, useSetAtom } from "jotai";
import { userAtom, deleteNoteAtom } from "../../store/index";
import { useNotesList } from "../../hooks/useNotesList";

export const OptionsButton = ({
  className,
  isOptionsOpen,
  index,
  isEditing,
  setIsEditing,
}: ComponentProps<"div"> & {
  isOptionsOpen: (isOpen: boolean) => void;
  index: number;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);

  const [user] = useAtom(userAtom);

  const deleteNote = useSetAtom(deleteNoteAtom);

  const { notes } = useNotesList({
    onSelect: () => {},
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node) &&
        !(event.target as Element).closest(".dropdown-option")
      ) {
        setIsOpen(false);
        isOptionsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    setIsOpen(false);
    isOptionsOpen(false);
  };

  const handleRename = () => {
    setIsEditing(true);
  };

  const handleDelete = async () => {
    await deleteNote(index);
    setIsOpen(false);
    isOptionsOpen(false);
  };

  return (
    <div
      ref={buttonRef}
      className={twMerge(
        "ml-auto transition-all duration-300 hover:text-white active:scale-100",
        isOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100",
        className
      )}
      onClick={(e) => e.stopPropagation()}
    >
      <div
        className="p-0.5"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
          isOptionsOpen(!isOpen);
        }}
      >
        <i
          className={twMerge(
            "bi bi-three-dots-vertical text-sm",
            isOpen ? "text-white" : "text-white/50"
          )}
        ></i>
      </div>
      {isOpen && (
        <DropDown
          className={twMerge("p-1 w-auto bg-zinc-900/70", isEditing ? "hidden" : "")}
          buttonRef={buttonRef as React.RefObject<HTMLElement>}
          onClose={() => setIsOpen(false)}
        >
          <Option
            className="dropdown-option "
            onClick={() => {
              const selectedNote = index != null ? notes?.[index] : null;
              const messages =
                selectedNote?.messages
                  ?.map(
                    (msg) =>
                      user?.name +
                      ": " +
                      msg.conversation.prompt +
                      "\n\n" +
                      msg.conversation.company +
                      " " +
                      msg.conversation.model +
                      ": " +
                      msg.conversation.response
                  )
                  .join("\n\n") || "";
              handleCopy(messages);
            }}
          >
            <i className="bi bi-clipboard2-plus mr-2"></i>
            Copy
          </Option>
          <Option className="dropdown-option" onClick={handleRename}>
            <i className="bi bi-pencil-fill mr-2"></i>
            Rename
          </Option>
          <Option className="dropdown-option" onClick={handleDelete}>
            <i className="bi bi-trash-fill mr-2 text-red-500"></i>
            Delete
          </Option>
        </DropDown>
      )}
    </div>
  );
};
