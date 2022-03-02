import { CognitoUserAmplify } from "@aws-amplify/ui";
import {
  createContext,
  Dispatch,
  FC,
  SetStateAction,
  useContext,
  useState,
  useEffect,
} from "react";
import { Auth, Hub } from "aws-amplify";
import { FormState } from "../forms/register/@types";
import { HubPayload } from "@aws-amplify/core";

type AppState = {
  user: CognitoUserAmplify | null;
  setUser: Dispatch<SetStateAction<CognitoUserAmplify | null>>;
  mode: "dark" | "light";
  setMode: Dispatch<SetStateAction<"dark" | "light">>;
  formState: FormState;
  setFormState: Dispatch<SetStateAction<FormState>>;
};
const AppContext = createContext<AppState>({} as AppState);
export function useAppContext() {
  const appContext = useContext(AppContext);
  if (!appContext) {
    throw new Error("Theme mode context accessed outside of provider tree");
  }
  return appContext;
}
export const AppWrapper: FC = ({ children }) => {
  Hub.listen("auth", (data) => {
    const { payload } = data;
    onAuthEvent(payload);
    // console.log(payload);
    // console.log(data)
  });
  useEffect(() => {
    const getCurrentUser = async () => {
      const user = await Auth.currentAuthenticatedUser();
      setUser(user);
      if (user) {
        setFormState('signedIn')
      }
    };
    getCurrentUser();
  }, []);
  const onAuthEvent = (payload: HubPayload) => {
    console.log("Payload", payload);
  };
  const [user, setUser] = useState<CognitoUserAmplify | null>(null);
  const [mode, setMode] = useState<"dark" | "light">("light");
  const [formState, setFormState] = useState<FormState>("signIn");
  const appState = { user, setUser, mode, setMode, formState, setFormState };

  return <AppContext.Provider value={appState}>{children}</AppContext.Provider>;
};
