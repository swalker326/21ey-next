import { useEffect } from "react";
import { Container, Nav, Navbar, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignIn, faSignOut, faUser } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { Auth } from "aws-amplify";
import { CognitoUserAmplify } from "@aws-amplify/ui";
import { useAppContext } from "../context/state";
import { useRouter } from "next/router";
import { ModeIcon } from "./shared/ModeIcon";

export const AppNavBar = () => {
  const state = useAppContext();
  const router = useRouter();
  // useEffect(() => {
  //   Auth.currentAuthenticatedUser().then((user: CognitoUserAmplify) => {
  //     user && state.setUser(user);
  //     state.setFormState("signedIn");
  //   });
  // }, []);
  const signOut = async () => {
    Auth.signOut().then(() => {
      state.setUser(null);
      state.setFormState("signIn");
    });
  };
  const handleSwitchChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    state.setMode(evt.target.checked ? "light" : "dark");
  };
  const handleButtonClick = () => {
    state.user ? signOut() : router.push("/profile");
  };
  return (
    <Navbar bg={state.mode} variant={state.mode}>
      <Container
        className={`Header ${
          state.mode === "dark" ? "bg-dark text-light" : "bg-light text-dark"
        }`}
      >
        <Nav className="w-100">
          <div className="d-flex w-100 justify-content-between align-items-center">
            <Link href="/" passHref>
              <div style={{ cursor: "pointer" }}>
                <h1>
                  21
                  <span style={{ color: "#F6BE00", fontWeight: 800 }}>ey</span>
                </h1>
              </div>
            </Link>
            <div className="d-flex align-items-center">
              <Form.Check
                onChange={handleSwitchChange}
                className="darkmode-switch"
                type="switch"
                checked={state.mode === "dark" ? false : true}
                id="custom-switch"
                label={state.mode === "dark" ? "Light" : "Dark"}
                style={{ marginRight: 9 }}
              />
              <div style={{ cursor: "pointer" }}>
                <Link href="/profile" passHref>
                  <ModeIcon
                    style={{ width: 30, height: 30 }}
                    icon={faUser}
                    color="#F6BE00"
                  />
                </Link>
                <ModeIcon
                  style={{ width: 30, height: 30, marginLeft: "12px" }}
                  color="#666"
                  icon={faSignOut}
                  onClick={handleButtonClick}
                />
              </div>
              {/* <FontAwesomeIcon color="#666" size="2x" icon={faSignIn} onClick={handleButtonClick}/> */}
            </div>
          </div>
        </Nav>
      </Container>
    </Navbar>
  );
};
