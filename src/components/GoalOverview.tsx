import { FC, useState } from "react";
import { Container, Modal, Row } from "react-bootstrap";
import dayjs, { Dayjs } from "dayjs";
import { Day } from "./Day";
import { ModeButton } from "./shared/ModeButton";
import { useAppContext } from "../context/state";
import styled from "styled-components";

const GoalOverview: FC = () => {
  const state = useAppContext();
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

  const [displayModal, setDisplayModal] = useState<boolean>(false);
  const [modalData, setModalData] = useState<string | undefined>(undefined);
  const handleClose = () => {
    console.log("Fired Handle Close");
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
    <Container className="CurrentGoal">
      <NameHeader>{name}</NameHeader>
      <Container className="Goal">
        <StartDateHeader style={{ color: "gray", fontWeight: 200 }}>
          {/* Started {startDateObj.format("MM/DD/YY")} */}
        </StartDateHeader>
        <Container>
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
        </Container>
      </Container>
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
    </Container>
  );
};

export default GoalOverview;

const NameHeader = styled.h2``;
const StartDateHeader = styled.h4`
  color: gray;
  font-weight: 200;
`;
const MessageModal = styled(Modal)`
  &.dark > .modal-dialog > .modal-content {
    background-color: #666;
  }
  .modal-body {
    margin: 0 1.5rem;
  }
`;
