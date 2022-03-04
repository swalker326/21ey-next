import { Dispatch, SetStateAction, useState, useEffect } from "react";
import dayjs, { Dayjs } from "dayjs";
import { Col } from "react-bootstrap";
import BlackX from "./shared/BlackXSvg";
import { updateGoal } from "../graphql/mutations";
import { API, graphqlOperation } from "aws-amplify";
import { GraphQLResult } from "@aws-amplify/api-graphql";
import { Observable } from "zen-observable-ts";
import { GoalStatus, OnUpdateGoalSubscription } from "../API";
import { onUpdateGoal } from "../graphql/subscriptions";
import { useAppContext } from "../context/state";
import { stat } from "fs";

type DayProps = {
  id: string | undefined | null;
  day: number;
  date: Dayjs;
  dayCompleted: boolean;
  daysCompleted: (string | null)[] | undefined | null;
  setDisplayModal: Dispatch<SetStateAction<boolean>>;
  setModalData: Dispatch<SetStateAction<string | undefined>>;
};

export const Day = ({
  id,
  day,
  date,
  dayCompleted,
  daysCompleted,
  setDisplayModal,
  setModalData,
}: DayProps) => {
  const state = useAppContext();
  const isToday = date.isSame(dayjs(), "day");
  const [isCompleted, setIsCompleted] = useState(dayCompleted);

  useEffect(() => {
    if (state.auth.user?.username) {
      const pubSubClient = API.graphql(
        graphqlOperation(onUpdateGoal),
      ) as Observable<object>;
      const subscription = pubSubClient.subscribe({
        next: (value: GraphQLResult<OnUpdateGoalSubscription>) => {
          console.log(value);
        },
      });
      return () => {
        subscription.unsubscribe();
      };
    }
  }, []);

  const updateGoalDailyCompletion = () => {
    const updatedGoal = {
      id,
      daysCompleted:
        daysCompleted && daysCompleted.length > 1
          ? [...daysCompleted, date.format("YYYY-MM-DD")]
          : [date.format("YYYY-MM-DD")],
    };
    if (state.auth.user) {
      API.graphql(graphqlOperation(updateGoal, { input: updatedGoal }));
    } else {
      if (state.data.activeGoal) {
        const newLocalGoal = {
          ...state.data.activeGoal,
          daysCompleted: updatedGoal.daysCompleted,
        };
        state.data.setLocalGoal(newLocalGoal);
        state.data.setActiveGoal(newLocalGoal);
      }
    }
    setIsCompleted(true);
  };

  const handleDayClick = () => {
    setModalData(`You can't complete tasks in the
    ${
      date.isAfter(dayjs(), "day") ? "future" : "past"
    }, we don't have enough road to get up to 88 mph!`);
    if (isToday) {
      if (isCompleted) {
        setModalData("You already completed this today");
        setDisplayModal(true);
      } else {
        updateGoalDailyCompletion();
      }
    } else {
      setDisplayModal(true);
    }
  };
  const dayHasPassed = date.isBefore(dayjs(), "day");
  const accentColor = state.theme.colorMode === "dark" ? "#cccccc" : "#777777";
  // const accentColor = state.theme.colorMode === "dark" ? "blue" : "red";

  return (
    <Col
      onClick={handleDayClick}
      xs={3}
      sm={2}
      style={{
        position: "relative",
        backgroundColor: isToday
          ? "#F6BE00"
          : dayHasPassed
          ? "lightgray"
          : "none",
        color: !dayHasPassed ? accentColor : "#777777",
        border: "1px solid gray",
        height: 100,
        //prevents double border on touching elements
        marginTop: "-1px",
        marginLeft: "-1px",
      }}
      className="flex"
    >
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <span
          style={{
            fontSize: 12,
          }}
        >
          Day: {day}
        </span>
        <div className="d-flex justify-content-center mt-2">
          {dayCompleted || isCompleted ? (
            <BlackX
              color="#666"
              width={50}
              heigth={50}
              style={{ top: 35, left: 65 }}
            />
          ) : null}
        </div>
      </div>
      <div
        style={{
          fontSize: 12,
          position: "absolute",
          right: 0,
          bottom: 0,
        }}
      >
        {date.format("M/DD")}
      </div>
    </Col>
  );
};
