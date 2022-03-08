import type { NextPage } from "next";
import Head from "next/head";
import { Col, Container, Row } from "react-bootstrap";
import styles from "../styles/Home.module.css";
import GoalOverview from "../src/components/GoalOverview";
import { useAppContext } from "../src/context/state";
import { CreateGoalForm } from "../src/forms/CreateGoalForm";
import Flex from "../public/Flex.svg";
import { Loader } from "../src/components/shared/Loader";

const Home: NextPage = () => {
  const state = useAppContext();

  return (
    <Container fluid>
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
              background-color: ${state.theme?.colorMode === "dark" && "#525659"
                ? "#525659"
                : "inhearit"};
              color: ${state.theme?.colorMode === "dark" ? "#f8f9fa" : "black"};
            }
          `}
        </style>
        <Loader>
          {state.data.activeGoal ? (
            <GoalOverview />
          ) : (
            <Container>
              <Row>
                <Col sm={12} md={6} style={{ padding: "1rem" }}>
                  <h1 className="my-4">
                    Make New Habits in{" "}
                    <span style={{ color: "#F6BE00" }}>21</span> days
                  </h1>
                  <div className="d-flex" style={{ width: "100%" }}>
                    <div
                      className="d-sm-none d-lg-flex"
                      style={{
                        width: 100,
                        height: 170,
                      }}
                    >
                      <Flex />
                    </div>
                    <div>
                      <h5>Its Simple</h5>
                      <ul>
                        <li>Create a goal</li>
                        <li>
                          Mark the goal completed everyday once you complete it
                        </li>
                        <li>
                          At the end of the 21 days you will instinctively do it
                        </li>
                      </ul>
                      <p
                        className="text-secondary"
                        style={{ fontWeight: 400, fontSize: "12px" }}
                      >
                        *Create an account to track your goal across multiple
                        devices
                      </p>
                    </div>
                  </div>
                </Col>
                <Col
                  sm={12}
                  md={6}
                  style={{ marginTop: "1rem", padding: "1rem" }}
                >
                  <CreateGoalForm />
                </Col>
              </Row>
            </Container>
          )}
        </Loader>
      </Container>
    </Container>
  );
};

export default Home;
