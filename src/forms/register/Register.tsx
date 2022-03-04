import React, { useState } from "react";
import { Auth } from "aws-amplify";
import { Container } from "react-bootstrap";
import { SignUpForm } from "./SignUpForm";
import { ConfirmSignUpForm } from "./ConfirmSignUpForm";
import { SignInForm } from "./SignInForm";
import { useAppContext } from "../../context/state";
import { FormInputState } from "./@types";

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

  if (state.auth.registerFormState === "signUp")
    return (
      <SignUpForm
        formInputState={formInputState}
        setFormInputState={setFormInputState}
        formSubmit={signup}
      />
    );
  if (state.auth.registerFormState === "signIn")
    return (
      <SignInForm
        formInputState={formInputState}
        setFormInputState={setFormInputState}
        formSubmit={signin}
      />
    );
  if (state.auth.registerFormState === "confirmSignUp")
    return (
      <ConfirmSignUpForm
        formInputState={formInputState}
        setFormInputState={setFormInputState}
        formSubmit={confirmSignUp}
      />
    );
  return <Container fluid>{children}</Container>;
};
