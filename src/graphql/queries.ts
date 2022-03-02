/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getGoal = /* GraphQL */ `
  query GetGoal($id: ID!) {
    getGoal(id: $id) {
      type
      id
      owner
      status
      name
      startDate
      createdAt
      daysCompleted
    }
  }
`;
export const listGoals = /* GraphQL */ `
  query ListGoals(
    $filter: ModelGoalFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listGoals(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        type
        id
        owner
        status
        name
        startDate
        createdAt
        daysCompleted
      }
      nextToken
    }
  }
`;
export const listGoalsBySpecificOwner = /* GraphQL */ `
  query ListGoalsBySpecificOwner(
    $owner: String
    $createdAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelGoalFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listGoalsBySpecificOwner(
      owner: $owner
      createdAt: $createdAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        type
        id
        owner
        status
        name
        startDate
        createdAt
        daysCompleted
      }
      nextToken
    }
  }
`;
