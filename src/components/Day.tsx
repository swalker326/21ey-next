import { Dispatch, SetStateAction } from "react";
import dayjs, { Dayjs } from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
dayjs.extend(advancedFormat);
import { darken, lighten } from "polished";
import { Col } from "react-bootstrap";
import CompletedX from "../../public/black_x.svg";
import { useAppContext } from "../context/state";
import { devices } from "../styles/devices";
import styled from "styled-components";
import { updateUserGoal } from "../actions/actions";

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
  const updateGoalDailyCompletion = async () => {
    console.log("FIred Update Goal Daily");
    console.log(!state.data.activeGoal?.id);
    if (!state.data.activeGoal?.name) return;
    const updatedGoal = {
      id: state.data.activeGoal.id || "local_goal",
      daysCompleted:
        state.data.activeGoal?.daysCompleted &&
        state.data.activeGoal.daysCompleted?.length > 0
          ? [...state.data.activeGoal.daysCompleted, date.format("YYYY-MM-DD")]
          : [date.format("YYYY-MM-DD")],
    };
    const updateGoalReponse = state.auth.user
      ? await updateUserGoal(state.data.activeGoal, updatedGoal)
      : await updateUserGoal(state.data.activeGoal, updatedGoal, true);

    if (!state.auth.user && updateGoalReponse) {
      state.data.setLocalGoal(updateGoalReponse);
    }
    if (updateGoalReponse) {
      state.data.setActiveGoal(updateGoalReponse);
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
    <DayContainer
      onClick={handleDayClick}
      xs={3}
      sm={2}
      className={`flex ${dayHasPassed ? "passed " : ""} ${
        state.theme.colorMode === "dark" ? "dark " : ""
      } ${isToday ? "today" : ""}`}
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
    </DayContainer>
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
const isToday = false;
const dayHasPassed = true;
const accentColor = "#666";
const DayContainer = styled(Col)`
  transition: all 0.2s ease-in-out;
  cursor: pointer;
  position: relative;
  background-color: "none";
  color: ${isToday ? "#777" : !dayHasPassed ? accentColor : "#777777"};
  border: 1px solid gray;
  height: 100px;
  //prevents double border on touching elements
  margin-top: -1px;
  margin-left: -1px;
  &:hover {
    background-color: ${darken(0.1, "#fff")};
    &.dark {
      background-color: ${darken(0.1, "#666")};
    }
  }
  &.passed {
    background-color: lightgray;
    &:hover {
      background-color: ${darken(0.1, "lightgray")};
    }
  }
  &.today {
    background-color: #f6be00;
    &:hover {
      background-color: ${lighten(0.1, "#f6be00")};
    }
  }
`;
const DateContainer = styled.div`
  font-size: 12px;
  position: absolute;
  right: 0;
  bottom: 0;
  padding: 0.5rem;
`;
