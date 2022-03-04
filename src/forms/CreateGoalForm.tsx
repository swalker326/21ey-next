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
import { Goal, useAppContext } from "../context/state";
import { GoalStatus } from "../API";
import { useLocalStorage } from "../hooks/useLocalStorage";

type GoalCreateFormState = {
  goalName: string;
};

const initialState: GoalCreateFormState = {
  goalName: "",
};

export const CreateGoalForm = () => {
  const state = useAppContext();
  const [goalState, setGoalState] = useState<GoalCreateFormState>(initialState);
  const CreateGoalFormSchema = object().shape({
    goalName: string(),
    startDate: date(),
  });

  const onChangeState = (e: ChangeEvent<HTMLInputElement>) => {
    setGoalState({ ...goalState, [e.target.name]: e.target.value });
  };

  return (
    <div style={{ display: "flex", width: "100%" }}>
      <Formik
        initialValues={{ goalName: "" }}
        validationSchema={CreateGoalFormSchema}
        onSubmit={async (values, { setSubmitting }) => {
          const newGoal = { name: values.goalName, startDate: dayjs().format("YYYY-MM-DD") };
          if (state.auth.user) {
            state.data.addGoal(newGoal);
          } else {
            state.data.addGoal(newGoal, true);
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
