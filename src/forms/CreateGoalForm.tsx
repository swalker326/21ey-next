import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import dayjs from "dayjs";
import { Form, Field, Formik } from "formik";
import { date, object, string } from "yup";
import { ModeButton } from "../components/shared/ModeButton";
import { API, graphqlOperation } from "aws-amplify";
import { createGoal } from "../graphql/mutations";
import { useAppContext } from "../context/state";
import { GoalStatus } from "../API";
import { useLocalStorage } from "../hooks/useLocalStorage";

type GoalCreateFormState = {
  goalName: string;
  startDate: string;
};
type LocalGoalAttributes = {
  name: string;
  type: "goal";
  owner: string;
  status: GoalStatus;
  startDate: string;
  createdAt: string;
  daysCompleted?: string[] | null;
};

export const CreateGoalForm = () => {
  const [localGoal, setLocalGoal] = useLocalStorage<LocalGoalAttributes>(
    "21ey_local_goal",
    {
      name: "",
      type: "goal",
      owner: "local_owner",
      status: GoalStatus.ACTIVE,
      startDate: "",
      createdAt: "",
      daysCompleted: [],
    },
  );
  const initialState: GoalCreateFormState = {
    goalName: "",
    startDate: dayjs().toISOString().split("T")[1],
  };
  const state = useAppContext();
  const [goalState, setGoalState] = useState<GoalCreateFormState>(initialState);
  const CreateGoalFormSchema = object().shape({
    goalName: string(),
    startDate: date(),
  });
  const addGoal = async () => {
    try {
      if (!goalState.goalName) return;
      const goal = {
        name: goalState.goalName,
        type: "goal",
        owner: state.user?.username,
        status: GoalStatus.ACTIVE,
        startDate: goalState.startDate,
        createdAt: dayjs().toISOString(),
      };
      console.log("Trying to add: ", goal);
      await API.graphql(graphqlOperation(createGoal, { input: goal }));
      setGoalState(initialState);
    } catch (err) {
      console.log("error creating goal: ", err);
    }
  };
  const addLocalGoal = () => {
    const goal: LocalGoalAttributes = {
      name: goalState.goalName,
      type: "goal",
      owner: "local_owner",
      status: GoalStatus.ACTIVE,
      startDate: goalState.startDate,
      createdAt: dayjs().toISOString(),
      daysCompleted: [],
    };
    setLocalGoal(goal);
  };
  const onChangeState = (e: ChangeEvent<HTMLInputElement>) => {
    setGoalState({ ...goalState, [e.target.name]: e.target.value });
  };

  return (
    <div style={{ display: "flex", width: "100%" }}>
      <Formik
        initialValues={{ goalName: "", startDate: dayjs() }}
        validationSchema={CreateGoalFormSchema}
        onSubmit={async (values, { setSubmitting }) => {
          if (state.user) {
            addGoal();
          } else {
            addLocalGoal();
          }
        }}
      >
        {({ handleChange }) => {
          return (
            <Form className="d-flex flex-column w-100">
              <Field
                id="goalName"
                type="text"
                name="goalName"
                value={goalState.goalName}
                placeholder="What's your new habit?"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  handleChange(event);
                  onChangeState(event);
                }}
                style={{ margin: "6px 0" }}
              />
              <label htmlFor="startDate">When do you want to start?</label>
              <Field
                id="stateDate"
                type="date"
                name="startDate"
                value={goalState.startDate}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  handleChange(event);
                  onChangeState(event);
                }}
                style={{ margin: "6px 0" }}
              />
              <div className="d-flex justify-content-end">
                <ModeButton type="submit">Add</ModeButton>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};
