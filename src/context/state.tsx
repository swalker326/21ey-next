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
import { GoalStatus, ListGoalsBySpecificOwnerQuery } from "../API";
import { createGoal } from "../graphql/mutations";
import { useLocalStorage } from "../hooks/useLocalStorage";
import dayjs from "dayjs";
import { listGoalsBySpecificOwner } from "../graphql/queries";
import { useRouter } from "next/router";

type ColorMode = "light" | "dark";

type AddGoalProps = {
  name: string;
  startDate: string;
  daysCompleted?: (string | null)[] | null;
};

export type Goal = {
  id?: string | null;
  name: string | undefined;
  type: string | undefined | null;
  owner: string | null | undefined;
  status: GoalStatus | null | undefined;
  startDate: string | null | undefined;
  createdAt: string | null | undefined;
  daysCompleted?: (string | null)[] | null;
};

type AppState = {
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  theme: {
    colorMode: ColorMode;
    setColorMode: Dispatch<SetStateAction<ColorMode>>;
  };
  auth: {
    user: CognitoUserAmplify | null;
    setUser: Dispatch<SetStateAction<CognitoUserAmplify | null>>;
    registerFormState: FormState;
    setRegisterFormState: Dispatch<SetStateAction<FormState>>;
    signIn: (username: string, password: string) => void;
    signOut: () => void;
  };
  data: {
    isLocalOnly: boolean;
    activeGoal: Goal | null;
    setActiveGoal: Dispatch<SetStateAction<Goal | null>>;
    localGoal: Goal | null;
    setLocalGoal: (goal: Goal) => void;
    createGoal: (goal: Goal) => void;
    addGoal: (
      { name, startDate }: AddGoalProps,
      isLocal?: boolean,
    ) => Promise<void>;
  };
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
  const router = useRouter();
  const [user, setUser] = useState<CognitoUserAmplify | null>(null);
  const [mode, setMode] = useState<"dark" | "light">("light");
  const [loading, setLoading] = useState(true);
  const [activeGoal, setActiveGoal] = useState<Goal | null>(null);
  const [formState, setFormState] = useState<FormState>("signIn");
  const [localGoal, setLocalGoal] = useLocalStorage<Goal | null>(
    "21ey_local_goal",
    null,
  );
  useEffect(() => {
    console.log("state useEffect fired");
    const getCurrentUser = async () => {
      try {
        const currentUser = await Auth.currentAuthenticatedUser();
        setUser(currentUser);
        if (currentUser) {
          console.log("user detected setting form state");
          setFormState("signedIn");
          fetchGoals(currentUser);
        }
      } catch (error) {
        if (error === "The user is not authenticated") {
          setLoading(false);
          console.log("no user checking for local goal");
          if (localGoal) {
            setActiveGoal(localGoal);
          }
        }
      }
    };
    getCurrentUser();
    Hub.listen("auth", (data) => {
      const { payload } = data;
      onAuthEvent(payload);
    });
  }, []);

  const onAuthEvent = (payload: HubPayload) => {
    console.log("On Auth Payload: ", payload);
    switch (payload.event) {
      case "signOut":
        console.log("Sign out Event fired");
        setUser(null);
        setFormState("signIn");
        setActiveGoal(null);
        break;
      case "signIn":
        console.log("Sign in Event fired");
        setUser(user);
        if (localGoal) {
          const newUserName = payload.data.username.toString();
          addLocalGoalToUser(localGoal, newUserName).then(() => {
            setLocalGoal(null);
          });
        } else {
          fetchGoals(payload.data);
        }
    }
  };

  const signOut = async () => {
    Auth.signOut().then(() => {
      setFormState("signIn");
    });
  };

  const signIn = async (user: string, password: string) => {
    Auth.signIn(user, password)
      .then(() => {
        setFormState("signedIn");
        router.push("/");
      })
      .catch((error) => console.log("Error Signing In: " + error));
  };

  const addGoal = async (
    { name, startDate }: AddGoalProps,
    isLocal = false,
  ) => {
    const goal = {
      name: name,
      type: "goal",
      owner: user?.username?.toString(),
      status: GoalStatus.ACTIVE,
      startDate: startDate,
      createdAt: dayjs().toISOString(),
    };
    console.log("Trying to add: ", goal);
    isLocal
      ? setLocalGoal(goal)
      : await API.graphql(graphqlOperation(createGoal, { input: goal }));
    setActiveGoal(goal);
  };

  const fetchGoals = async (passedUser: CognitoUserAmplify) => {
    try {
      const goalData = (await API.graphql(
        graphqlOperation(listGoalsBySpecificOwner, {
          owner: passedUser?.username || user?.username?.toString(),
        }),
      )) as { data: ListGoalsBySpecificOwnerQuery };
      console.log(
        "GoalData? :",
        goalData.data?.listGoalsBySpecificOwner?.items &&
          goalData.data.listGoalsBySpecificOwner.items.length > 0,
      );
      if (
        goalData.data.listGoalsBySpecificOwner?.items &&
        goalData.data.listGoalsBySpecificOwner.items.length > 0
      ) {
        const fetchedGoal: Goal = {
          id: goalData.data?.listGoalsBySpecificOwner?.items?.[0]?.id,
          name: goalData.data?.listGoalsBySpecificOwner?.items?.[0]?.name,
          type: goalData.data?.listGoalsBySpecificOwner?.items?.[0]?.type,
          owner: goalData.data?.listGoalsBySpecificOwner?.items?.[0]?.owner,
          status: goalData.data?.listGoalsBySpecificOwner?.items?.[0]?.status,
          startDate:
            goalData.data?.listGoalsBySpecificOwner?.items?.[0]?.startDate,
          createdAt:
            goalData.data?.listGoalsBySpecificOwner?.items?.[0]?.createdAt,
          daysCompleted:
            goalData.data?.listGoalsBySpecificOwner?.items?.[0]?.daysCompleted,
        };
        setActiveGoal(fetchedGoal);
        console.log("setActiveGoal to : ", fetchedGoal);
      } else {
        setActiveGoal(null);
        console.log("No Local Goal or stored goal found, create one");
      }
      setLoading(false);
    } catch (error) {
      console.log("Error fetching goals", error);
      setLoading(false);
      setActiveGoal(null);
    }
  };

  const addLocalGoalToUser = async (goal: Goal, newUserName: string) => {
    const { name, startDate, createdAt, daysCompleted } = goal;
    try {
      const goal: Goal = {
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

  const appState: AppState = {
    loading,
    setLoading,
    theme: {
      colorMode: mode,
      setColorMode: setMode,
    },
    auth: {
      user,
      setUser,
      registerFormState: formState,
      setRegisterFormState: setFormState,
      signIn,
      signOut,
    },
    data: {
      isLocalOnly: false, //#TODO
      activeGoal,
      setActiveGoal,
      localGoal: localGoal, //#TODO
      createGoal: () => {}, //#TODO
      setLocalGoal,
      addGoal,
    },
  };

  return <AppContext.Provider value={appState}>{children}</AppContext.Provider>;
};
