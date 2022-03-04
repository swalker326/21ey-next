import { FC, useState } from "react";
import { Col, Container, Modal, Row } from "react-bootstrap";
import dayjs, { Dayjs } from "dayjs";
import { Day } from "./Day";
import { Goal } from "../API";
import { ModeButton } from "./shared/ModeButton";
import { useAppContext } from "../context/state";

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
  const startDateObj = dayjs(startDate);
  const endDate = startDateObj.add(21, "days");
  const days = Array.from(Array(endDate.diff(startDateObj, "days")).keys());
  const [displayModal, setDisplayModal] = useState<boolean>(false);
  const [modalData, setModalData] = useState<string | undefined>(undefined);
  const daysAsDates = days.map((index) => {
    return index === 0 ? startDateObj : startDateObj.add(index, "day");
  });
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
      <h2>{name}</h2>
      <Container className="Goal">
        <h4 style={{ color: "gray", fontWeight: 200 }}>
          Started {startDateObj.format("MM/DD/YY")}
        </h4>
        <Container>
          <Row>
            {daysAsDates.map((date: Dayjs, index: number) => {
              return (
                <Day
                  id={id}
                  daysCompleted={daysCompleted}
                  dayCompleted={isDayCompleted(date)}
                  setModalData={setModalData}
                  key={index}
                  date={date}
                  day={index + 1}
                  setDisplayModal={setDisplayModal}
                />
              );
            })}
          </Row>
        </Container>
      </Container>
      <Modal
        show={displayModal}
        onHide={handleClose}
      >
        <Modal.Header closeButton>
          <Modal.Title>Hold Up</Modal.Title>
        </Modal.Header>
        <Modal.Body className="my-4">{modalData}</Modal.Body>
        <Modal.Footer>
          <ModeButton variant="secondary" onClick={handleClose}>
            Close
          </ModeButton>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default GoalOverview;
