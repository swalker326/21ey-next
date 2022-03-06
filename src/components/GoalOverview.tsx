import { FC, useState } from "react";
import { Container, Modal, Row } from "react-bootstrap";
import dayjs, { Dayjs } from "dayjs";
import { Day } from "./Day";
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
      <h2>{name}</h2>
      <Container className="Goal">
        <h4 style={{ color: "gray", fontWeight: 200 }}>
          {/* Started {startDateObj.format("MM/DD/YY")} */}
        </h4>
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
      <Modal show={displayModal} onHide={handleClose}>
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
