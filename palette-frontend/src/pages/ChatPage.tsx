import { Content, Sidebar, RootLayout } from "../components/AppLayout";

import SignIn from "../pages/SignIn";

import { SideBarActionRow } from "../components/SideBarActionRow";
import { GeneratedChat } from "../components/GeneratedChat";
import { UserInputArea } from "../components/UserInputArea";
import { ContentActionRow } from "../components/buttons/ContentActionRow";
//import { SearchBox } from './components/SearchBox'
import { ChatHistory } from "../components/ChatHistory";
import { tokenAtom } from "../store";
import { isSearchOpenAtom } from "../store";
import { currImageArrayAtom } from "../store";
import { useAtom } from "jotai";
import { useRef } from "react";

export const ChatPage = () => {
  const [token] = useAtom(tokenAtom);
  const contentRef = useRef<HTMLDivElement>(null);
  const [, setCurrImageArray] = useAtom(currImageArrayAtom);
  const [isSearchOpen] = useAtom(isSearchOpenAtom);
  const onSelect = () => {
    setCurrImageArray([]);
  };
  return (
    <>
      {token ? (
        <>
          <RootLayout className="">
            <Sidebar className="relative bg-black/30 backdrop-blur-sm border-r border-purple-500/20">
              <SideBarActionRow className="left-[200px] z-10 rounded-full" />
              <ChatHistory
                className="h-full mt-7"
                contentRef={contentRef as React.RefObject<HTMLDivElement>}
                onSelect={onSelect}
              />
            </Sidebar>

            <Content className="border-l bg-black/20 backdrop-blur-sm border-purple-500/30 flex flex-col p-2 h-screen">
              <ContentActionRow />

              <GeneratedChat className="ml-2 mr-2 flex-grow overflow-auto mb-10" />
              <UserInputArea
                className="mt-auto"
                contentRef={contentRef as React.RefObject<HTMLDivElement>}
              />
              {/* {isSearchOpen && <SearchBox />}  */}
            </Content>
          </RootLayout>
        </>
      ) : (
        <SignIn />
        //<div>SignIn</div>
      )}
    </>
  );
};
