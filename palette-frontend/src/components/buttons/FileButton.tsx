import { twMerge } from "tailwind-merge";
import { currImageArrayAtom } from "../../store";
import { useAtom } from "jotai";

export const FileButton = ({
  className,
  img,
  name,
  type,
}: {
  className?: string;
  img: {
    data: string;
    name: string;
    type: string;
  };
  name: string;
  type: string;
}) => {
  const [, setCurrImageArray] = useAtom(currImageArrayAtom);
  const isImage = img.data.startsWith("data:image");

  return (
    <div
      className={twMerge(
        "bg-zinc-900/70 text-xs border border-white/20 rounded-lg flex items-center justify-between px-1.5 py-0.5 m-1 hover:bg-zinc-900/20 transition-all duration-300 cursor-pointer z-100",
        className
      )}
    >
      {isImage ? (
        <div className="flex items-center gap-1.5 h-[10px]">
          <img src={img.data} alt={name} className="h-5 w-5 object-cover rounded" />
          <span className="truncate max-w-[72px] inline-block">{name}</span>
        </div>
      ) : (
        <div className="flex items-center gap-1.5">
          <div className="h-5 w-5 bg-zinc-800 rounded flex items-center justify-center">
            <i className={`bi bi-file-earmark-${type} text-sm`}></i>
          </div>
          <span className="truncate max-w-[72px] inline-block">{name}</span>
        </div>
      )}

      <div
        className="flex items-center hover:bg-zinc-900/20 transition-all duration-300 cursor-pointer rounded-full p-0.5 ml-1"
        onClick={() => {
          setCurrImageArray((prevArray) =>
            prevArray.filter(
              (image) => typeof image.imageData === "string" && image.imageData !== img.data
            )
          );
        }}
      >
        <i className="bi bi-x text-[10px]"></i>
      </div>
    </div>
  );
};
