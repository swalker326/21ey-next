import { Container, Nav, Navbar, Form } from "react-bootstrap";
import {
  faSignOut,
  faUser,
  faCircleHalfStroke,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { Auth } from "aws-amplify";
import { useAppContext } from "../context/state";
import { useRouter } from "next/router";
import { ModeIcon } from "./shared/ModeIcon";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const AppNavBar = () => {
  const state = useAppContext();
  const router = useRouter();

  const handleSwitchChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    state.setMode(evt.target.checked ? "light" : "dark");
  };

  const handleSignoutClick = () => {
    state.user ? state.signOut() : router.push("/profile");
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
                label={<ModeIcon color="#666" icon={faCircleHalfStroke} />}
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
              </div>
              {/* <FontAwesomeIcon color="#666" size="2x" icon={faSignIn} onClick={handleButtonClick}/> */}
            </div>
          </div>
        </Nav>
      </Container>
    </Navbar>
  );
};
