import React, { useState, useEffect } from "react";
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
  const isAuthtenicated = async () => {
    try {
      const currentUser = await Auth.currentAuthenticatedUser();
      return currentUser;
    } catch (err) {
      console.log(err);
    }
  };

  const signup = async () => {
    try {
      await Auth.signUp({
        username: formInputState.email,
        password: formInputState.password,
        attributes: {
          email: formInputState.email,
        },
      });
      /* Once the user successfully signs up, update form state to show the confirm sign up form for MFA */
      setFormInputState({ ...formInputState });
      state.setFormState("confirmSignUp");
    } catch (err) {
      console.log({ err });
    }
  };
  const confirmSignUp = async () => {
    try {
      await Auth.confirmSignUp(
        formInputState.email,
        formInputState.verificationCode,
      );
      /* Once the user successfully confirms their account, update form state to show the sign in form*/
      setFormInputState({ ...formInputState });
      state.setFormState('signIn')
    } catch (err) {
      console.log({ err });
    }
  };

  const signin = async () => {
    try {
      Auth.signIn(formInputState.email, formInputState.password).then(
        (user) => {
          setFormInputState({ ...formInputState });
          state.setUser(user);
          state.setFormState('signedIn')
        },
      );
    } catch (err) {
      console.log({ err });
    }
  };

  if (state.formState === "signUp")
    return (
      <SignUpForm
        formInputState={formInputState}
        setFormInputState={setFormInputState}
        formSubmit={signup}
      />
    );
  if (state.formState === "signIn")
    return (
      <SignInForm
        formInputState={formInputState}
        setFormInputState={setFormInputState}
        formSubmit={signin}
      />
    );
  if (state.formState === "confirmSignUp")
    return (
      <ConfirmSignUpForm
        formInputState={formInputState}
        setFormInputState={setFormInputState}
        formSubmit={confirmSignUp}
      />
    );
  return <Container fluid>{children}</Container>;
};
