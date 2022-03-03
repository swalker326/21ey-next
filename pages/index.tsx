import type { NextPage } from "next";
import { useEffect, useState } from "react";
import Head from "next/head";
import { Col, Container, Row } from "react-bootstrap";
import styles from "../styles/Home.module.css";
import dayjs from "dayjs";
import GoalOverview from "../src/components/GoalOverview";
import { useAppContext } from "../src/context/state";
import { CreateGoalForm } from "../src/forms/CreateGoalForm";
import { API, graphqlOperation, Auth } from "aws-amplify";
import { listGoalsBySpecificOwner } from "../src/graphql/queries";
import { ListGoalsBySpecificOwnerQuery, Goal } from "../src/API";
import { Loader } from "@aws-amplify/ui-react";
import Flex from "../public/Flex.svg";

const Home: NextPage = () => {
  const state = useAppContext();
  const [goals, setGoals] = useState<ListGoalsBySpecificOwnerQuery | null>();
  const [loading, setLoading] = useState(true);
  let localGoalString;
  if (typeof window !== "undefined" && !state.user) {
    localGoalString = window.localStorage.getItem("21ey_local_goal");
  }
  const localGoal = localGoalString && JSON.parse(localGoalString);

  const fetchGoals = async () => {
    console.log("Fetch Goals Fired");
    try {
      const goalData = (await API.graphql(
        graphqlOperation(listGoalsBySpecificOwner, {
          owner: state?.user?.username?.toString(),
        }),
      )) as { data: ListGoalsBySpecificOwnerQuery };
      setGoals(goalData.data);
      setLoading(false);
    } catch (err) {
      setGoals(null);
    }
  };
  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then((user) => {
        state.setUser(user);
      })
      .catch((error) => {
        state.setUser(null);
        setLoading(false);
      });
  }, []);
  useEffect(() => {
    fetchGoals();
  }, [state.user]);
  return (
    <div className={styles.container}>
      <Head>
        <title>21ey</title>
        <meta name="description" content="Make positive habits" />
      </Head>
      <Container
        fluid
        style={{
          margin: 0,
          height: "100%",
        }}
      >
        <style jsx global>
          {`
            body {
              background-color: ${state.mode === "dark"
                ? "#525659"
                : "inhearit"};
              color: ${state.mode === "dark" ? "#f8f9fa" : "black"};
            }
          `}
        </style>
        {loading ? (
          <Loader />
        ) : goals?.listGoalsBySpecificOwner?.items?.[0] || localGoal ? (
          localGoal ? (
            <GoalOverview goal={localGoal} />
          ) : (
            <GoalOverview goal={goals?.listGoalsBySpecificOwner?.items?.[0]} />
          )
        ) : (
          <Container>
            <Col>
              <Row className="justify-content-center">
                <h3 className="mx-5 my-5">
                  No Goals, slacker! Fill out the form below to create a goal
                  and start tracking your progress.
                </h3>
                <div
                  className="d-flex justify-content-around"
                  style={{ width: "70%" }}
                >
                  <CreateGoalForm />
                  <div style={{ width: 70, height: 170 }}>
                    <Flex />
                  </div>
                </div>
              </Row>
            </Col>
          </Container>
        )}
      </Container>
    </div>
  );
};

export default Home;
