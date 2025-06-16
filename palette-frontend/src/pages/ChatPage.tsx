import { Content, Sidebar, RootLayout } from "../components/AppLayout";

import SignIn from "../pages/SignIn";

import { SideBarActionRow } from "../components/SideBarActionRow";
import { GeneratedChat } from "../components/GeneratedChat";
import { UserInputArea } from "../components/UserInputArea";
import { ContentActionRow } from "../components/buttons/ContentActionRow";

import { ChatHistory } from "../components/ChatHistory";
import { tokenAtom } from "../store";

import { currImageArrayAtom } from "../store";
import { useAtom } from "jotai";
import { useRef } from "react";

export const ChatPage = () => {
  const [token] = useAtom(tokenAtom);
  const contentRef = useRef<HTMLDivElement>(null);
  const [, setCurrImageArray] = useAtom(currImageArrayAtom);

  const onSelect = () => {
    setCurrImageArray([]);
  };
  return (
    <>
      {token ? (
        <>
          <RootLayout className="">
            <Sidebar className="relative bg-black/30 backdrop-blur-sm border-r border-purple-500/20 mt-0 no-scrollbar">
              <div className="flex items-center gap-2 px-2 sm:px-4 py-2 mb-3 sm:mb-5">
                <span className="text-white/70 text-2xl sm:text-3xl md:text-4xl font-bold ml-2 sm:ml-6 md:ml-10">
                  Palette
                </span>
                <img
                  src="./LogoMain.png"
                  alt="Palette Logo"
                  className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full"
                />
              </div>

              <SideBarActionRow className="left-[200px] z-10 rounded-full" />
              <ChatHistory
                className="h-full mt-7"
                contentRef={contentRef as React.RefObject<HTMLDivElement>}
                onSelect={onSelect}
              />
            </Sidebar>

            <Content className="border-l bg-black/20 backdrop-blur-sm border-purple-500/30 flex flex-col pl-45 pr-45 h-screen">
              <div className="flex flex-col -mx-40">
                <ContentActionRow />
              </div>

              <GeneratedChat className="ml-2 mr-2 flex-grow overflow-auto mb-10" />
              <div className="flex flex-col -mx-5">
                <UserInputArea
                  className="mt-auto bg"
                  contentRef={contentRef as React.RefObject<HTMLDivElement>}
                />
              </div>
            </Content>
          </RootLayout>
        </>
      ) : (
        <SignIn />
      )}
    </>
  );
};
