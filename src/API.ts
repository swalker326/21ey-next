/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type CreateGoalInput = {
  type: string,
  id?: string | null,
  owner: string,
  status?: GoalStatus | null,
  name: string,
  startDate: string,
  createdAt: string,
  daysCompleted?: Array< string | null > | null,
};

export enum GoalStatus {
  ACTIVE = "ACTIVE",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}


export type ModelGoalConditionInput = {
  type?: ModelStringInput | null,
  status?: ModelGoalStatusInput | null,
  name?: ModelStringInput | null,
  startDate?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  daysCompleted?: ModelStringInput | null,
  and?: Array< ModelGoalConditionInput | null > | null,
  or?: Array< ModelGoalConditionInput | null > | null,
  not?: ModelGoalConditionInput | null,
};

export type ModelStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export enum ModelAttributeTypes {
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
  _null = "_null",
}


export type ModelSizeInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
};

export type ModelGoalStatusInput = {
  eq?: GoalStatus | null,
  ne?: GoalStatus | null,
};

export type Goal = {
  __typename: "Goal",
  type?: string,
  id?: string | null,
  owner?: string,
  status?: GoalStatus | null,
  name?: string,
  startDate?: string,
  createdAt?: string,
  daysCompleted?: Array< string | null > | null,
};

export type UpdateGoalInput = {
  type?: string | null,
  id: string,
  owner?: string | null,
  status?: GoalStatus | null,
  name?: string | null,
  startDate?: string | null,
  createdAt?: string | null,
  daysCompleted?: Array< string | null > | null,
};

export type DeleteGoalInput = {
  id?: string | null,
};

export type ModelGoalFilterInput = {
  type?: ModelStringInput | null,
  id?: ModelIDInput | null,
  owner?: ModelStringInput | null,
  status?: ModelGoalStatusInput | null,
  name?: ModelStringInput | null,
  startDate?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  daysCompleted?: ModelStringInput | null,
  and?: Array< ModelGoalFilterInput | null > | null,
  or?: Array< ModelGoalFilterInput | null > | null,
  not?: ModelGoalFilterInput | null,
};

export type ModelIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export type ModelGoalConnection = {
  __typename: "ModelGoalConnection",
  items?:  Array<Goal | null > | null,
  nextToken?: string | null,
};

export type ModelStringKeyConditionInput = {
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
};

export enum ModelSortDirection {
  ASC = "ASC",
  DESC = "DESC",
}


export type CreateGoalMutationVariables = {
  input?: CreateGoalInput,
  condition?: ModelGoalConditionInput | null,
};

export type CreateGoalMutation = {
  createGoal?:  {
    __typename: "Goal",
    type: string,
    id?: string | null,
    owner: string,
    status?: GoalStatus | null,
    name: string,
    startDate: string,
    createdAt: string,
    daysCompleted?: Array< string | null > | null,
  } | null,
};

export type UpdateGoalMutationVariables = {
  input?: UpdateGoalInput,
  condition?: ModelGoalConditionInput | null,
};

export type UpdateGoalMutation = {
  updateGoal?:  {
    __typename: "Goal",
    type: string,
    id?: string | null,
    owner: string,
    status?: GoalStatus | null,
    name: string,
    startDate: string,
    createdAt: string,
    daysCompleted?: Array< string | null > | null,
  } | null,
};

export type DeleteGoalMutationVariables = {
  input?: DeleteGoalInput,
  condition?: ModelGoalConditionInput | null,
};

export type DeleteGoalMutation = {
  deleteGoal?:  {
    __typename: "Goal",
    type: string,
    id?: string | null,
    owner: string,
    status?: GoalStatus | null,
    name: string,
    startDate: string,
    createdAt: string,
    daysCompleted?: Array< string | null > | null,
  } | null,
};

export type GetGoalQueryVariables = {
  id?: string,
};

export type GetGoalQuery = {
  getGoal?:  {
    __typename: "Goal",
    type: string,
    id?: string | null,
    owner: string,
    status?: GoalStatus | null,
    name: string,
    startDate: string,
    createdAt: string,
    daysCompleted?: Array< string | null > | null,
  } | null,
};

export type ListGoalsQueryVariables = {
  filter?: ModelGoalFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListGoalsQuery = {
  listGoals?:  {
    __typename: "ModelGoalConnection",
    items?:  Array< {
      __typename: "Goal",
      type: string,
      id?: string | null,
      owner: string,
      status?: GoalStatus | null,
      name: string,
      startDate: string,
      createdAt: string,
      daysCompleted?: Array< string | null > | null,
    } | null > | null,
    nextToken?: string | null,
  } | null,
};

export type ListGoalsBySpecificOwnerQueryVariables = {
  owner?: string | null,
  createdAt?: ModelStringKeyConditionInput | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelGoalFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListGoalsBySpecificOwnerQuery = {
  listGoalsBySpecificOwner?:  {
    __typename: "ModelGoalConnection",
    items?:  Array< {
      __typename: "Goal",
      type: string,
      id?: string | null,
      owner: string,
      status?: GoalStatus | null,
      name: string,
      startDate: string,
      createdAt: string,
      daysCompleted?: Array< string | null > | null,
    } | null > | null,
    nextToken?: string | null,
  } | null,
};

export type OnCreateGoalSubscription = {
  onCreateGoal?:  {
    __typename: "Goal",
    type: string,
    id?: string | null,
    owner: string,
    status?: GoalStatus | null,
    name: string,
    startDate: string,
    createdAt: string,
    daysCompleted?: Array< string | null > | null,
  } | null,
};

export type OnUpdateGoalSubscription = {
  onUpdateGoal?:  {
    __typename: "Goal",
    type: string,
    id?: string | null,
    owner: string,
    status?: GoalStatus | null,
    name: string,
    startDate: string,
    createdAt: string,
    daysCompleted?: Array< string | null > | null,
  } | null,
};

export type OnDeleteGoalSubscription = {
  onDeleteGoal?:  {
    __typename: "Goal",
    type: string,
    id?: string | null,
    owner: string,
    status?: GoalStatus | null,
    name: string,
    startDate: string,
    createdAt: string,
    daysCompleted?: Array< string | null > | null,
  } | null,
};
