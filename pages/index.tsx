import type { NextPage } from "next";
import { useEffect, useState } from "react";
import Head from "next/head";
import { Container } from "react-bootstrap";
import styles from "../styles/Home.module.css";
import dayjs from "dayjs";
import GoalOverview from "../src/components/GoalOverview";
import { useAppContext } from "../src/context/state";
import { CreateGoalForm } from "../src/forms/CreateGoalForm";
import { API, graphqlOperation } from "aws-amplify";
import { listGoals, listGoalsBySpecificOwner } from "../src/graphql/queries";
import { ListGoalsBySpecificOwnerQuery, Goal } from "../src/API";
import { Loader } from "@aws-amplify/ui-react";

const Home: NextPage = () => {
  const state = useAppContext();
  const [goalAdded, setGoalAdded] = useState<boolean>(false);
  const [goals, setGoals] = useState<ListGoalsBySpecificOwnerQuery>();
  const [loading, setLoading] = useState(false);
  const fetchGoals = async () => {
    try {
      const goalData = (await API.graphql(
        graphqlOperation(listGoalsBySpecificOwner, {
          owner: state?.user?.username?.toString(),
        }),
      )) as { data: ListGoalsBySpecificOwnerQuery };
      // setGoals(goalData.data.listGoalsBySpecificOwner?.items[0]);
      setGoals(goalData.data);
      setLoading(false);
    } catch (err) {
      console.log("Error: ", err);
    }
  };
  useEffect(() => {
    console.log("state.user.username :", state?.user?.username);
    if (state.user?.username) {
      fetchGoals();
    }
  }, []);
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
        ) : goals?.listGoalsBySpecificOwner?.items?.[0] ? (
          <GoalOverview goal={goals.listGoalsBySpecificOwner.items[0]} />
        ) : (
          <CreateGoalForm setGoalAdded={setGoalAdded} />
        )}
      </Container>
    </div>
  );
};

export default Home;
