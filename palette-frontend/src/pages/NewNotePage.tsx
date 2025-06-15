import { type ComponentProps } from "react";
import { ChatBox } from "../components/ChatBox";
import { userAtom } from "../store";
import { useAtom } from "jotai";

export const NewNotePage = ({
  className,

  sendFunction,
  setRows,
  MAX_ROWS,
  setMessage,
  ...props
}: ComponentProps<"div"> & {
  sendFunction: () => void;
  setRows: React.Dispatch<React.SetStateAction<number>>;
  MAX_ROWS: number;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [user] = useAtom(userAtom);
  return (
    <div className="flex flex-col items-center justify-center h-full w-[85%]" {...props}>
      <div className="relative w-full mb-10">
        <h1 className="text-center text-8xl font-bold text-zinc-800 select-none drop-shadow-[0_0_15px_rgba(255,255,255,.4)]">
          Palette
        </h1>
        <h1 className="text-center text-4xl font-bold text-zinc-800 select-none drop-shadow-[0_0_15px_rgba(255,255,255,1)]">
          Welcome {user?.name}
        </h1>
      </div>

      <ChatBox
        sendFunction={sendFunction}
        setRows={setRows}
        MAX_ROWS={MAX_ROWS}
        setMessage={setMessage}
      />
    </div>
  );
};
