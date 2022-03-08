import { Dispatch, SetStateAction } from "react";
import dayjs, { Dayjs } from "dayjs";
import advancedFormat from 'dayjs/plugin/advancedFormat'
dayjs.extend(advancedFormat)
import { Col } from "react-bootstrap";
import CompletedX from "../../public/black_x.svg";
import { updateGoal } from "../graphql/mutations";
import { API, graphqlOperation } from "aws-amplify";
import { Goal, useAppContext } from "../context/state";
import { UpdateGoalMutation } from "../API";
import { devices } from "../styles/devices";
import styled from "styled-components";

type DayProps = {
  day: number;
  date: Dayjs;
  isCompleted: boolean;
  setDisplayModal: Dispatch<SetStateAction<boolean>>;
  setModalData: Dispatch<SetStateAction<string | undefined>>;
};

export const Day = ({
  day,
  date,
  isCompleted,
  setModalData,
  setDisplayModal,
}: DayProps) => {
  const state = useAppContext();
  const isToday = date.isSame(dayjs(), "day");

  const updateGoalDailyCompletion = () => {
    const updatedGoal = {
      id: state.data.activeGoal?.id,
      daysCompleted:
        state.data.activeGoal?.daysCompleted &&
        state.data.activeGoal.daysCompleted?.length > 0
          ? [...state.data.activeGoal.daysCompleted, date.format("YYYY-MM-DD")]
          : [date.format("YYYY-MM-DD")],
    };
    if (state.auth.user) {
      console.log("user detected");
      API.graphql(graphqlOperation(updateGoal, { input: updatedGoal })).then(
        ({ data: { updateGoal } }: { data: UpdateGoalMutation }) => {
          if (updateGoal) {
            const newGoal: Goal = {
              id: updateGoal.id,
              owner: updateGoal.owner,
              type: updateGoal.type,
              name: updateGoal.name,
              daysCompleted: updateGoal.daysCompleted,
              createdAt: updateGoal.createdAt,
              startDate: updateGoal.startDate,
              status: updateGoal.status,
            };
            state.data.setActiveGoal(newGoal);
          }
        },
      );
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
        color: isToday ? "#777" : !dayHasPassed ? accentColor : "#777777",
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
            paddingTop: "4.5px",
          }}
        >
          Day: {day}
        </span>
        <div className="d-flex justify-content-center mt-2">
          {isCompleted ? (
            <CompletedSvg>
              <CompletedX />
            </CompletedSvg>
          ) : null}
        </div>
      </div>
      <DateContainer>{date.format("Do")}</DateContainer>
    </Col>
  );
};

const CompletedSvg = styled.div`
  fill: #666;
  width: 60px;
  height: 60px;
  ${devices.custom(800)} {
    width: 30px;
    height: 30px;
  }
`;
const DateContainer = styled.div`
  font-size: 12px;
  position: absolute;
  right: 0;
  bottom: 0;
  padding: 0.5rem;
`;
