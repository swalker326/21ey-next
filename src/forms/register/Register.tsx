import React, { useState } from "react";
import { Auth } from "aws-amplify";
import { Col, Container, Row } from "react-bootstrap";
import { SignUpForm } from "./SignUpForm";
import { ConfirmSignUpForm } from "./ConfirmSignUpForm";
import { SignInForm } from "./SignInForm";
import { useAppContext } from "../../context/state";
import { FormInputState } from "./@types";
import styled from "styled-components";

export const Register: React.FC = ({ children }) => {
  const state = useAppContext();
  const initialFormValues: FormInputState = {
    password: "",
    email: "",
    verificationCode: "",
  };
  const [formInputState, setFormInputState] =
    useState<FormInputState>(initialFormValues);

  const signup = async () => {
    try {
      await Auth.signUp({
        username: formInputState.email,
        password: formInputState.password,
        attributes: {
          email: formInputState.email,
        },
      });
      setFormInputState({ ...formInputState });
      state.auth.setRegisterFormState("confirmSignUp");
    } catch (err) {
      console.error(`Error siging up: ${{ err }}`);
    }
  };
  const confirmSignUp = async () => {
    try {
      await Auth.confirmSignUp(
        formInputState.email,
        formInputState.verificationCode,
      );
      setFormInputState(initialFormValues);
      state.auth.setRegisterFormState("signIn");
    } catch (err) {
      console.error(`Error confirming sign up: ${{ err }}`);
    }
  };

  const signin = async () => {
    state.auth.signIn(formInputState.email, formInputState.password);
  };
  const FormWrapper: React.FC = ({ children }) => {
    return (
      <Container
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          // width: "80%",
          height: "20rem",
          backgroundColor: "#F6BE00",
          marginTop: "1rem",
          borderRadius: "12px",
        }}
      >
        {children}
      </Container>
    );
  };
  const formStateComponents = {
    signUp: (
      <SignUpForm
        formInputState={formInputState}
        setFormInputState={setFormInputState}
        formSubmit={signup}
      />
    ),
    signIn: (
      <SignInForm
        formInputState={formInputState}
        setFormInputState={setFormInputState}
        formSubmit={signin}
      />
    ),
    confirmSignUp: (
      <ConfirmSignUpForm
        formInputState={formInputState}
        setFormInputState={setFormInputState}
        formSubmit={confirmSignUp}
      />
    ),
    signedIn: (
      <Container fluid>
        <div className="register">{children}</div>
      </Container>
    ),
  };

  return (
    <Container className="mt-4">
      <ErrorContaier
        sm={8}
        className={`error-container ${
          state.auth.errors.length > 0 ? "show" : null
        }`}
      >
        {state.auth.errors.map((error: string, index) => (
          <ErrorMessage key={`error_${index}`}>{error}</ErrorMessage>
        ))}
      </ErrorContaier>
      {formStateComponents[state.auth.registerFormState]}
    </Container>
  );
};

const ErrorContaier = styled(Container)`
  display: none;
  justify-content: flex-start;
  &.show {
    display: flex;
  }
`;
const ErrorMessage = styled(Col)`
  color: #ff000090;
  max-width: 500px;
  padding: 8px;
  margin-bottom: 1rem;
  border-radius: 4px;
  font-weight: 600;
  border: 1px solid red;
  background-color: #ff000030;
`;
