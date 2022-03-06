import { Spinner, Container } from "react-bootstrap";
import { useAppContext } from "../../context/state";

export const Loader: React.FC = ({ children }) => {
  const state = useAppContext();
  return (
    <Container>
      {state.loading ? (
        <Container className="d-flex justify-content-center">
          <Spinner
            animation="grow"
            style={{ width: 100, height: 100, color: "#F6BE00" }}
          />
        </Container>
      ) : (
        <Container fluid>{children}</Container>
      )}
    </Container>
  );
};
