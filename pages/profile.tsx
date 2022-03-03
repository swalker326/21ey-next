import "@aws-amplify/ui-react/styles.css";
import { faSignOut } from "@fortawesome/free-solid-svg-icons";
import { Container } from "react-bootstrap";
import { ModeIcon } from "../src/components/shared/ModeIcon";
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
      <ModeIcon
        style={{ width: 30, height: 30, marginLeft: "12px" }}
        color="#666"
        icon={faSignOut}
        onClick={state.signOut}
      />
      <Container>
        <h3>{state.user ? `Hi ${state.user.attributes?.email}` : null}</h3>
      </Container>
    </Register>
  );
};

export default Profile;
