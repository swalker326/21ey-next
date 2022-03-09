import { FC, SetStateAction, useState, useRef } from "react";
import { Container, Modal, Row } from "react-bootstrap";
import dayjs, { Dayjs } from "dayjs";
import { Day } from "./Day";
import { ModeButton } from "./shared/ModeButton";
import { useAppContext } from "../context/state";
import styled from "styled-components";

const GoalOverview: FC = () => {
  const state = useAppContext();
  const [displayModal, setDisplayModal] = useState<boolean>(false);
  const [showCopy, setShowCopy] = useState<"show" | "hide">("hide");
  const [modalData, setModalData] = useState<string | undefined>(undefined);

  const buildShare = () => {
    setShowCopy("show");
    setTimeout(() => {
      setShowCopy("hide");
    }, 2500);

    const shareString = daysArray.map((day, index) => {
      const newLine = index === 6 || index === 13;
      return isDayCompleted(day.date)
        ? `${String.fromCharCode(9989)} ${newLine ? "\n" : ""}`
        : `${String.fromCharCode(11036)} ${newLine ? "\n" : ""}`;
    });

    navigator.clipboard.writeText(
      `21ey completed ${
        state.data.activeGoal?.daysCompleted?.length
      }/21 \n${shareString.join("")}`,
    );
  };

  const goal = state.data.activeGoal
    ? state.data.activeGoal
    : state.data.localGoal;

  let id: string | null | undefined,
    name: string | undefined,
    startDate: string | undefined | null,
    daysCompleted: (string | null)[] | null | undefined;

  if (goal) {
    ({ name, startDate, daysCompleted, id } = goal);
  }

  const daysArray = Array.from(Array(21).keys()).map((i) => {
    return {
      day: i + 1,
      date: i === 0 ? dayjs(startDate) : dayjs(startDate).add(i, "day"),
    };
  });

  const handleClose = () => {
    setDisplayModal(false);
  };

  const isDayCompleted = (date: Dayjs) => {
    const daysArray =
      daysCompleted &&
      daysCompleted.length > 0 &&
      daysCompleted.map((d) => dayjs(d));
    let completed = false;
    daysArray &&
      daysArray.forEach((d) => {
        if (d.isSame(date, "day")) completed = true;
      });
    return completed;
  };
  return (
    <GoalOverviewContainer fluid className="CurrentGoal">
      <GoalOverviewHeader>
        <NameHeader>{name}</NameHeader>
        {/* {JSON.stringify(state.data.activeGoal)} */}
        <div style={{ position: "relative" }}>
          <CopiedAlert className={showCopy}>Copied</CopiedAlert>
          <ModeButton onClick={buildShare}>Share Progress</ModeButton>
        </div>
      </GoalOverviewHeader>
      <GoalOverviewContainer fluid className="Goal">
        <StartDateHeader>
          {/* Started {startDateObj.format("MM/DD/YY")} */}
        </StartDateHeader>
        <GoalOverviewContainer fluid>
          <Row>
            {daysArray.map(({ date, day }) => {
              return (
                <Day
                  key={day}
                  date={date}
                  day={day}
                  isCompleted={isDayCompleted(date)}
                  setModalData={setModalData}
                  setDisplayModal={setDisplayModal}
                />
              );
            })}
          </Row>
        </GoalOverviewContainer>
      </GoalOverviewContainer>
      <MessageModal
        className={state.theme.colorMode}
        show={displayModal}
        onHide={handleClose}
      >
        <Modal.Header closeButton>
          <Modal.Title>Hold Up</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalData}</Modal.Body>
        <Modal.Footer>
          <ModeButton variant="secondary" onClick={handleClose}>
            Close
          </ModeButton>
        </Modal.Footer>
      </MessageModal>
    </GoalOverviewContainer>
  );
};

export default GoalOverview;

const NameHeader = styled.h2``;
const StartDateHeader = styled.h4`
  color: gray;
  font-weight: 200;
`;
const GoalOverviewHeader = styled(Container)`
  margin-top: 2rem;
  display: flex;
  justify-content: space-between;
`;
const CopiedAlert = styled.div`
  position: absolute;
  left: -3.75rem;
  top: 6px;
  color: #666;
  border-radius: 6px;
  transition: opacity 0.5s;
  opacity: 0;
  &.show {
    transition: opacity 0.5s;
    opacity: 1;
  }
`;
const GoalOverviewContainer = styled(Container)`
  margin: 0;
  padding: 0;
`;
const MessageModal = styled(Modal)`
  &.dark > .modal-dialog > .modal-content {
    background-color: #666;
  }
  .modal-body {
    margin: 0 1.5rem;
  }
`;
