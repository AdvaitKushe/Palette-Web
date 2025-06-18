import { type ComponentProps, useMemo } from "react";
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

  // Group notes by time periods
  const groupedNotes = useMemo(() => {
    if (!notes) return { today: [], last7Days: [], older: [] };

    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    const sevenDays = 7 * oneDay;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStart = today.getTime();

    const sevenDaysAgo = new Date(now - sevenDays);

    return notes.reduce(
      (acc, note, index) => {
        const noteDate = new Date(note.lastEditTime);

        if (note.lastEditTime >= todayStart) {
          acc.today.push({ ...note, originalIndex: index });
        } else if (note.lastEditTime >= sevenDaysAgo.getTime()) {
          acc.last7Days.push({ ...note, originalIndex: index });
        } else {
          acc.older.push({ ...note, originalIndex: index });
        }

        return acc;
      },
      { today: [], last7Days: [], older: [] } as {
        today: Array<(typeof notes)[0] & { originalIndex: number }>;
        last7Days: Array<(typeof notes)[0] & { originalIndex: number }>;
        older: Array<(typeof notes)[0] & { originalIndex: number }>;
      }
    );
  }, [notes]);

  if (!notes) return null;

  if (isEmpty(notes)) {
    return (
      <ul className={twMerge("text-center pt-4", className)}>
        <span className="text-zinc-400">No notes yet</span>
      </ul>
    );
  }

  return (
    <ul className={twMerge("h-[calc(100vh-180px)] overflow-y-auto", className)} {...props}>
      {/* Today */}
      {groupedNotes.today.length > 0 && (
        <>
          <li className="px-2 py-1 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
            Today
          </li>
          {groupedNotes.today.map((note) => (
            <ChatPreview
              isActive={note.originalIndex === selectedNoteIndex}
              key={note.originalIndex}
              title={note.title}
              onClick={handleNoteSelect(note.originalIndex)}
              index={note.originalIndex}
            />
          ))}
        </>
      )}

      {/* Last 7 Days */}
      {groupedNotes.last7Days.length > 0 && (
        <>
          <li className="px-2 py-1 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
            Last 7 Days
          </li>
          {groupedNotes.last7Days.map((note) => (
            <ChatPreview
              isActive={note.originalIndex === selectedNoteIndex}
              key={note.originalIndex}
              title={note.title}
              onClick={handleNoteSelect(note.originalIndex)}
              index={note.originalIndex}
            />
          ))}
        </>
      )}

      {/* Older */}
      {groupedNotes.older.length > 0 && (
        <>
          <li className="px-2 py-1 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
            Older
          </li>
          {groupedNotes.older.map((note) => (
            <ChatPreview
              isActive={note.originalIndex === selectedNoteIndex}
              key={note.originalIndex}
              title={note.title}
              onClick={handleNoteSelect(note.originalIndex)}
              index={note.originalIndex}
            />
          ))}
        </>
      )}
    </ul>
  );
};
