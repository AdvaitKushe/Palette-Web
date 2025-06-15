// @ts-nocheck
import { twMerge } from "tailwind-merge";
import { ComponentProps, useEffect, useRef, useState } from "react";
import { ActionButton } from "./ActionButton";

import { SettingsDropdown } from "../SettingsDropDown";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useAtom } from "jotai";
import { userIDAtom } from "../../store";
import { db } from "../../firebase/fire";

export const Settings = ({ className, ...props }: ComponentProps<"div">) => {
  const [isOpen, setIsOpen] = useState(false);
  const [userID] = useAtom(userIDAtom);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [settings, setSettings] = useState({
    OpenAI: "",
    Gemini: "",
    Anthropic: "",
  });

  const initSettings = async () => {
    if (userID) {
      const userRef = doc(db, "users", userID);
      const userDoc = await getDoc(userRef);

      // @ts-ignore
      setSettings(
        {
          OpenAI: userDoc.data()?.settings.OpenAI,
          Gemini: userDoc.data()?.settings.Gemini,
          Anthropic: userDoc.data()?.settings.Anthropic,
        } || { OpenAI: "", Gemini: "", Anthropic: "" }
      );
    }

  };

  useEffect(() => {
    // initilize settings from firestore
    initSettings();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSettingsChange = async (value: string[]) => {
    setSettings({ OpenAI: value[0], Gemini: value[1], Anthropic: value[2] });

    if (userID) {
      try {
        const userRef = doc(db, "users", userID);
        await updateDoc(userRef, {
          "settings.OpenAI": value[0],
          "settings.Gemini": value[1],
          "settings.Anthropic": value[2],
        });
      } catch (error) {
        console.error("Error updating settings in Firestore:", error);
      }
    }
  };

  return (
    <div
      ref={dropdownRef}
      className={twMerge(
        "flex flex-row items-center justify-center z-50 align-middle",
        isOpen ? "bg-zinc-600/40  text-white rounded-md" : "",
        className
      )}
      {...props}
    >
      <ActionButton
        onClick={() => {
          console.log("settings clicked");
          setIsOpen(!isOpen);
        }}
      >
        <div className="flex flex-row items-center gap-2">
          <i className="bi bi-gear flex items-center"></i>
          <span className="text-sm">Settings</span>
          <i className="bi bi-chevron-down flex items-center"></i>
        </div>

      </ActionButton>
      {isOpen && (
        <div className="absolute right-0 top-10 w-96 ">
          <SettingsDropdown
            className="mt-5"
            openai={settings.OpenAI}
            gemini={settings.Gemini}
            anthropic={settings.Anthropic}
            onSettingsChange={handleSettingsChange}
          />
        </div>
      )}
    </div>
  );
};
