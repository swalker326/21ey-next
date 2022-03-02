import "@aws-amplify/ui-react/styles.css";
import { Container } from "react-bootstrap";
import { useAppContext } from "../src/context/state";
import { Register } from "../src/forms/register/Register";

export const Profile = () => {
  const state = useAppContext();
  return (
    <Register>
      <style jsx global>
        {`
          body {
            background-color: ${state.mode === "dark" ? "#525659" : "inhearit"};
            color: ${state.mode === "dark" ? "#f8f9fa" : "black"};
          }
        `}
      </style>
      <Container>
        <h3>{state.user ? `Hi ${state.user.attributes?.email}` : null}</h3>
      </Container>
    </Register>
  );
};

export default Profile;
