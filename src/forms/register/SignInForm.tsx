import React, { ChangeEvent } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { ModeButton } from "../../components/shared/ModeButton";
import { RegisterFormProps } from "./@types";
import { Formik, Form, Field } from "formik";
import { object, string } from "yup";
import { useAppContext } from "../../context/state";

export const SignInForm = ({
  setFormInputState,
  formSubmit,
  formInputState,
}: RegisterFormProps) => {
  const state = useAppContext();
  const SignUpFormSchema = object().shape({
    email: string().email("Invalid email address format").required("Required"),
    password: string(),
  });
  const onChangeStateUpdate = (e: ChangeEvent<HTMLInputElement>) => {
    setFormInputState({ ...formInputState, [e.target.name]: e.target.value });
  };
  return (
    <Container fluid className="d-flex justify-content-center">
      <Col className="d-flex flex-column" sm="8">
        <h1 className="mt-4">Sign In</h1>
        <Formik
          enableReinitialize
          initialValues={{
            email: "",
            password: "",
            status: "idle",
          }}
          validationSchema={SignUpFormSchema}
          onSubmit={async (values, { setSubmitting }) => {
            formSubmit();
            setSubmitting(false);
          }}
        >
          {({ handleChange }) => {
            return (
              <Form style={{ maxWidth: "500px" }}>
                <div
                  className="form-group"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Field
                    type="email"
                    id="email"
                    name="email"
                    value={formInputState.email}
                    placeholder="Enter email"
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      handleChange(event);
                      onChangeStateUpdate(event);
                    }}
                    style={{ margin: "6px 0" }}
                  />

                  <Field
                    id="password"
                    type="password"
                    name="password"
                    value={formInputState.password}
                    placeholder="Enter password"
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      handleChange(event);
                      onChangeStateUpdate(event);
                    }}
                    style={{ margin: "6px 0" }}
                  />
                </div>
                <div className="d-flex justify-content-between">
                  <ModeButton type="submit" className="mt-4">
                    Sign In
                  </ModeButton>
                  <ModeButton
                    onClick={() => state.auth.setRegisterFormState("signUp")}
                    variant="outline-dark"
                    type="button"
                    className="mt-4"
                  >
                    Create Account
                  </ModeButton>
                </div>
              </Form>
            );
          }}
        </Formik>
      </Col>
    </Container>
  );
};
