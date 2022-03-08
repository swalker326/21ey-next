import { faSignOut } from "@fortawesome/free-solid-svg-icons";
import { API, graphqlOperation } from "aws-amplify";
import { useEffect, useState } from "react";
import styled from "styled-components";
import Link from "next/link";
import {
  Goal,
  GoalStatus,
  ListGoalsBySpecificOwnerQuery,
  UpdateGoalInput,
  UpdateGoalMutation,
} from "../API";
import { updateGoal } from "../graphql/mutations";
import { useAppContext } from "../context/state";
import { listGoalsBySpecificOwner } from "../graphql/queries";
import { Loader } from "./shared/Loader";
import { ModeButton } from "./shared/ModeButton";
import { ModeIcon } from "./shared/ModeIcon";
import dayjs from "dayjs";

export const UserProfile = () => {
  const state = useAppContext();
  const [goals, setGoals] = useState<ListGoalsBySpecificOwnerQuery>();
  const [buttonText, setButtonText] = useState<string>("abandon");

  useEffect(() => {
    let isCancelled = false;
    if (!isCancelled) {
      fetchUserGoals();
    }
    return () => {
      isCancelled = true;
    };
  }, []);

  const fetchUserGoals = async () => {
    state.setLoading(true);
    const userGoals = (await API.graphql(
      graphqlOperation(listGoalsBySpecificOwner, {
        owner: state.auth.user?.username,
      }),
    )) as {
      data: ListGoalsBySpecificOwnerQuery;
    };
    if (
      userGoals.data?.listGoalsBySpecificOwner?.items &&
      userGoals.data.listGoalsBySpecificOwner.items.length > 0
    ) {
      setGoals(userGoals.data);
    }
    state.setLoading(false);
  };

  const getGoalStatus = (status: GoalStatus) => {
    let formattedStatues = status.toString().toLocaleLowerCase();
    formattedStatues =
      formattedStatues.charAt(0).toLocaleUpperCase() +
      formattedStatues.slice(1);
    return formattedStatues;
  };

  const updateGoalData = async (updateInput: UpdateGoalInput) => {
    await API.graphql(graphqlOperation(updateGoal, { input: updateInput }));
  };

  const abandonGoal = async (goal: Goal) => {
    if (goal.id) {
      updateGoalData({ id: goal?.id, status: GoalStatus.FAILED })
        .then(fetchUserGoals)
        .catch((error) => console.error(error));
    }
  };
  const restartGoal = (goal: Goal) => {
    if (goal.name)
      state.data
        .addGoal({
          name: goal.name,
          startDate: dayjs().format("YYYY-MM-DD"),
        })
        .then(fetchUserGoals)
        .catch((error) => console.error(error));
  };
  const shareGoal = () => {
    //logic to share goal, should move share logic from overview to context
    //and just pull this method in from state
  };

  const handleGoalButtonClick = (goal: Goal) => {
    const actions = {
      ACTIVE: (goalProp: Goal) => abandonGoal(goalProp),
      COMPLETED: () => shareGoal,
      FAILED: (goalProp: Goal) => restartGoal(goalProp),
    };
    if (goal.status) {
      actions[goal.status](goal);
    }
  };

  return (
    <Loader>
      <ProfileHeader>
        <h3>
          {state.auth.user
            ? `Welcome ${state.auth.user.attributes?.email}`
            : null}
        </h3>
        <ModeButton color="#666" onClick={state.auth.signOut}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span style={{ marginRight: "1rem" }}>Sign Out</span>
            <ModeIcon icon={faSignOut} />
          </div>
        </ModeButton>
      </ProfileHeader>
      <ProfileBody>
        {goals?.listGoalsBySpecificOwner?.items?.length ? (
          goals.listGoalsBySpecificOwner.items.map((goal) => {
            if (goal) {
              return (
                <GoalWrapper
                  key={goal.id}
                  className={state.theme.colorMode === "dark" ? "dark" : ""}
                >
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <h4>{goal.name} </h4>
                    <GoalStatusContainer>
                      <GoalStatusValue>
                        statues:{" "}
                        {goal.status ? getGoalStatus(goal.status) : null}
                      </GoalStatusValue>
                      <ModeButton
                        color="#666"
                        onClick={() => handleGoalButtonClick(goal)}
                      >
                        {goal.status === GoalStatus.ACTIVE
                          ? "Abandon"
                          : goal.status === GoalStatus.FAILED
                          ? "Restart"
                          : "Share"}
                      </ModeButton>
                    </GoalStatusContainer>
                  </div>
                  <div>
                    <h5>
                      <DaysCompleted style={{ color: "#F6BE00" }}>
                        {goal.daysCompleted?.length || 0} of 21{" "}
                      </DaysCompleted>
                      <span style={{ fontWeight: 200 }}>days completed</span>
                    </h5>
                  </div>
                </GoalWrapper>
              );
            }
          })
        ) : (
          <div>
            You're not tracking any habits 😿 get started by{" "}
            <Link href="/" passHref>
              <NewGoalLink>creating a new goal</NewGoalLink>
            </Link>
          </div>
        )}
      </ProfileBody>
    </Loader>
  );
};

const ProfileBody = styled.div``;
const ProfileHeader = styled.div`
  display: flex;
  justify-content: space-between;
`;
const DaysCompleted = styled.span`
  color: #f6be00;
`;
const GoalStatusContainer = styled.div`
  display: flex;
  position: absolute;
  right: 1rem;
  flex-direction: column;
  align-items: center;
`;
const GoalStatusValue = styled.span`
  font-weight: 200;
  margin-bottom: 0.5rem;
`;
const GoalWrapper = styled.div`
  position: relative;
  padding: 1.2rem;
  margin-top: 2rem;
  border-radius: 8px;
  background-color: #ebebeb;
  &.dark {
    background-color: #838383;
  }
`;
const NewGoalLink = styled.a`
  color: #f6be00;
  text-decoration: none;
  &:hover {
    color: #f6be0090;
  }
`;
