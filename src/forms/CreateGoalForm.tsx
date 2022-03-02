import { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { Form, Field, Formik } from "formik";
import { date, object, string } from "yup";
import { ModeButton } from "../components/ModeButton";
import { API, graphqlOperation } from "aws-amplify";
import { createGoal } from "../graphql/mutations";
import { useAppContext } from "../context/state";
import { GoalStatus } from "../API";

type GoalCreateFormState = {
  goalName: string;
  startDate: string;
};

type GoalCreateFormProps = {
  setGoalAdded: Dispatch<SetStateAction<boolean>>
}

export const CreateGoalForm = ({setGoalAdded}:GoalCreateFormProps) => {
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
      console.log("Trying to add: ", goal)
      await API.graphql(graphqlOperation(createGoal, { input: goal }));
      setGoalAdded(true);
      setGoalState(initialState);
    } catch (err) {
      console.log("error creating goal: ", err);
    }
  };
  const onChangeState = (e: ChangeEvent<HTMLInputElement>) => {
    setGoalState({ ...goalState, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <Formik
        initialValues={{ goalName: "", startDate: dayjs() }}
        validationSchema={CreateGoalFormSchema}
        onSubmit={async (values, { setSubmitting }) => {
          addGoal();
        }}
      >
        {({ handleChange }) => {
          return (
            <Form className="d-flex flex-column" style={{ maxWidth: "500px" }}>
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
              <label htmlFor="startDate">
                When do you want to start your new habit?
              </label>
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
              <ModeButton type="submit">Add Goal</ModeButton>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};
