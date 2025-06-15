import { RootSignIn } from "../components/AppLayout";
import { ActionButton } from "../components/buttons/ActionButton";
import { tokenAtom, userIDAtom, loadNotesAtom } from "../store";
import { useAtom } from "jotai";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { provider } from "../firebase/fire";
import { type User } from "../../shared/model";

import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase/fire";
//import { useEffect } from 'react'
import { userAtom } from "../store";
import { useRef,  } from "react";

interface GoogleUserInfo {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
}

export default function SignIn() {
  const [, setToken] = useAtom(tokenAtom);
  const [, setUserID] = useAtom(userIDAtom);
  const [, loadNotes] = useAtom(loadNotesAtom);
  const [, setUser] = useAtom(userAtom);

  const auth = getAuth();

  const hasAttemptedSignIn = useRef(false);

  const onClickSignIn = async () => {
    if (!hasAttemptedSignIn.current) {
      hasAttemptedSignIn.current = true;

      try {
        const result = await signInWithPopup(auth, provider);
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        const user = result.user;

        console.log(user);
        console.log(token);

        // Get user info from Google
        const response = await fetch(
          `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${token}`
        );
        const userInfo: GoogleUserInfo = await response.json();

        setUser(userInfo as unknown as User);
        setToken(token || null);

        // Store user info in Firestore
        if (userInfo.id) {
          setUserID(userInfo.id);
          const docRef = doc(db, "users", userInfo.id);

          // Check if user document exists
          const docSnap = await getDoc(docRef);

          if (!docSnap.exists()) {
            // Create new user document
            await setDoc(docRef, {
              settings: {
                email: userInfo.email,
                name: userInfo.name,
                picture: userInfo.picture,
                OpenAI: "",
                Gemini: "",
                Anthropic: "",
              },
            });
            console.log("New user document created");
          } else {
            console.log("User document already exists");
          }

          await loadNotes();
        }
      } catch (error) {
        console.error("Authentication error:", error);
        hasAttemptedSignIn.current = false; // Reset on error so user can try again
      }
    }
  };

  return (
    <RootSignIn className="flex items-center justify-center">
      <div className="flex flex-col justify-center items-center pl-10 pr-10 pt-5 pb-5 w-[300px] h-[300px] shadow-lg bg-black/40 backdrop-blur-md rounded-lg shadow-purple-900/50 border border-purple-500/20">
        <div className="text-xl font-bold text-center mb-6 text-purple-100">Welcome to Palette</div>
        <ActionButton
          className="bg-purple-800/30 border-purple-500/50 hover:bg-purple-700/40 hover:border-purple-400/70 transition-all duration-300"
          onClick={onClickSignIn}
        >
          <i className="bi bi-google mr-2 text-purple-200"></i>
          <span className="text-purple-100">Sign in with Google</span>
        </ActionButton>
      </div>
    </RootSignIn>
  );
}
