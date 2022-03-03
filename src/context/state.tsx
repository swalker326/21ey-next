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
import { API, Auth, graphqlOperation, Hub } from "aws-amplify";
import { FormState } from "../forms/register/@types";
import { HubPayload } from "@aws-amplify/core";
import { faBreadSlice } from "@fortawesome/free-solid-svg-icons";
import { GoalStatus } from "../API";
import { createGoal } from "../graphql/mutations";

type AppState = {
  user: CognitoUserAmplify | null;
  setUser: Dispatch<SetStateAction<CognitoUserAmplify | null>>;
  mode: "dark" | "light";
  setMode: Dispatch<SetStateAction<"dark" | "light">>;
  formState: FormState;
  setFormState: Dispatch<SetStateAction<FormState>>;
  signOut: () => void;
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
  });
  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const user = await Auth.currentAuthenticatedUser();
        setUser(user);
        if (user) {
          setFormState("signedIn");
        }
      } catch (error) {
        console.log("Error in state useEffect", error);
      }
    };
    getCurrentUser();
  }, []);
  const onAuthEvent = (payload: HubPayload) => {
    switch (payload.event) {
      case "signOut":
        setUser(null);
        setFormState("signIn");
        break;
      case "signIn":
        if (
          typeof window !== "undefined" &&
          window.localStorage.getItem("21ey_local_goal") !== null
        ) {
          const newUserName = payload.data.username.toString();
          const goalString = window.localStorage.getItem("21ey_local_goal")
          const goal = goalString && JSON.parse(goalString);
          addLocalGoalToUser(goal, newUserName);
        }
    }
  };
  const addLocalGoalToUser = async (goal:{name:string, startDate: string, createdAt:string, daysCompleted:string[]|null}, newUserName:string) => {
    const {name, startDate,createdAt, daysCompleted} = goal
    try {
      const goal = {
        name: name,
        type: "goal",
        owner: newUserName,
        status: GoalStatus.ACTIVE,
        startDate: startDate,
        createdAt: createdAt,
        daysCompleted: daysCompleted,
      };
      console.log("Trying to add: ", goal);
      await API.graphql(graphqlOperation(createGoal, { input: goal }));
    } catch (err) {
      console.log("error creating goal: ", err);
    }
  };
  const [user, setUser] = useState<CognitoUserAmplify | null>(null);
  const [mode, setMode] = useState<"dark" | "light">("light");
  const [formState, setFormState] = useState<FormState>("signIn");
  const signOut = async () => {
    Auth.signOut().then(() => {
      setUser(null);
      setFormState("signIn");
    });
  };
  const appState = {
    user,
    setUser,
    mode,
    setMode,
    formState,
    setFormState,
    signOut,
  };

  return <AppContext.Provider value={appState}>{children}</AppContext.Provider>;
};
