import type { NextPage } from "next";
import { useEffect, useState } from "react";
import Head from "next/head";
import { Col, Container, Row } from "react-bootstrap";
import styles from "../styles/Home.module.css";
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
              <Row>
                <div className="d-flex justify-content-around">
                  <div style={{ padding: "1rem" }}>
                    <h3 className="mb-5">No Goals... slacker!</h3>
                    <div className="d-flex" style={{ width: "100%" }}>
                      <div>
                        <h4>Its Simple</h4>
                        <ul style={{ width: "80%" }}>
                          <li>Create a goal</li>
                          <li>Mark the goal completed when you complete it</li>
                        </ul>
                        <p
                          className="text-secondary"
                          style={{ fontWeight: 400, fontSize: "12px" }}
                        >
                          *Create an account to track your goal across multiple
                          devices
                        </p>
                      </div>
                      <div
                        style={{
                          width: 70,
                          height: 170,
                        }}
                      >
                        <Flex />
                      </div>
                    </div>
                  </div>
                  <div
                    style={{ marginTop: "1rem", width: "50%", padding: "1rem" }}
                  >
                    <CreateGoalForm />
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
