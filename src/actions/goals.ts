import { API, graphqlOperation } from "aws-amplify";
import dayjs from "dayjs";
import { GoalStatus, ListGoalsBySpecificOwnerQuery, UpdateGoalInput, UpdateGoalMutation, Goal, CreateGoalInput, CreateGoalMutation } from "../API";
import { createGoal, updateGoal } from "../graphql/mutations";
import { listGoalsBySpecificOwner } from "../graphql/queries";

type AddGoalProps = {
  name: string;
  startDate: string;
  daysCompleted?: (string | null)[] | null;
  owner: string;
};

export const addUserGoal = async (
  { name, startDate, owner }: AddGoalProps, isLocal = false
): Promise<Goal> => {
  const goal: CreateGoalInput = {
    name: name,
    type: "goal",
    owner: owner,
    status: GoalStatus.ACTIVE,
    startDate: startDate,
    createdAt: dayjs().toISOString(),
  };
  if (!isLocal) {
    const response = await API.graphql(graphqlOperation(createGoal, { input: goal })) as { data: CreateGoalMutation }
    if (response.data.createGoal) {
      return response.data.createGoal;
    }
  } else {
    typeof window !== undefined && window.localStorage.setItem("21ey_local_goal", JSON.stringify({ ...goal, id: 'local_goal' }))
  }

  return { ...goal, __typename: "Goal", id: "local_goal" };
};

export const updateUserGoal = async (activeGoal: Goal, updateInput: UpdateGoalInput, isLocal = false): Promise<Goal | null | undefined> => {
  let o = Object.fromEntries(Object.entries(updateInput).filter(([_, v]) => v != null));
  let newGoal: Goal = {
    ...activeGoal,
    ...o
  }
  if (!isLocal) {
    const response = await API.graphql(graphqlOperation(updateGoal, { input: updateInput })) as { data: UpdateGoalMutation }
    console.log("new updated goal: ", response.data.updateGoal);
    if (response.data.updateGoal) {
      newGoal = response.data.updateGoal;
    }
  } else if (typeof window !== undefined) {
    window.localStorage.setItem("21ey_local_goal", JSON.stringify(newGoal))
  }
  return newGoal
}

export const fetchGoalsByUser = async (owner: string) => {
  const response = await API.graphql(graphqlOperation(listGoalsBySpecificOwner, { owner })) as ListGoalsBySpecificOwnerQuery;
  console.log(response.listGoalsBySpecificOwner?.items)


}