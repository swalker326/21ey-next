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
            background-color: ${state.theme.colorMode === "dark" ? "#525659" : "inhearit"};
            color: ${state.theme.colorMode === "dark" ? "#f8f9fa" : "black"};
          }
        `}
      </style>
      <ModeIcon
        style={{ width: 30, height: 30, marginLeft: "12px" }}
        color="#666"
        icon={faSignOut}
        onClick={state.auth.signOut}
      />
      <Container>
        <h3>{state.auth.user ? `Hi ${state.auth.user.attributes?.email}` : null}</h3>
      </Container>
    </Register>
  );
};

export default Profile;
