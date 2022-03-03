import { Dispatch, SetStateAction, useState, useEffect } from "react";
import dayjs, { Dayjs } from "dayjs";
import { Col } from "react-bootstrap";
import BlackX from "./shared/BlackXSvg";
import { updateGoal } from "../graphql/mutations";
import { API, graphqlOperation } from "aws-amplify";
import { GraphQLResult } from "@aws-amplify/api-graphql";
import { Observable } from "zen-observable-ts";
import { OnUpdateGoalSubscription } from "../API";
import { onUpdateGoal } from "../graphql/subscriptions";
import { useAppContext } from "../context/state";

type DayProps = {
  id: string | undefined | null;
  day: number;
  date: Dayjs;
  dayCompleted: boolean;
  daysCompleted: (string | null)[] | undefined | null;
  setDisplayModal: Dispatch<SetStateAction<boolean>>;
  setModalData: Dispatch<SetStateAction<string | undefined>>;
  localGoal?: object|null;
};

export const Day = ({
  id,
  day,
  date,
  dayCompleted,
  daysCompleted,
  setDisplayModal,
  setModalData,
  localGoal
}: DayProps) => {
  const state = useAppContext();
  const isToday = date.isSame(dayjs(), "day");
  const [isCompleted, setIsCompleted] = useState(dayCompleted);

  useEffect(() => {
    if (state.user?.username) {
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
    API.graphql(graphqlOperation(updateGoal, { input: updatedGoal }));
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

  return (
    <Col
      onClick={handleDayClick}
      xs={3}
      sm={2}
      style={{
        backgroundColor: isToday
          ? "#F6BE00"
          : date.isBefore(dayjs(), "day")
          ? "lightgray"
          : "none",
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
        {day}
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
    </Col>
  );
};
