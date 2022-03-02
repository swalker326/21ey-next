import React, { ChangeEvent } from "react";
import { RegisterFormProps } from "./@types";
import { Container, Row, Col } from "react-bootstrap";
import { Formik, Form, Field } from "formik";
import { object, string } from "yup";
import { ModeButton } from "../../components/shared/ModeButton";
import { useAppContext } from "../../context/state";

export const SignUpForm = ({
  formInputState,
  setFormInputState,
  formSubmit,
}: RegisterFormProps) => {
  const state = useAppContext();
  const SignUpFormSchema = object().shape({
    email: string().email("Invalid email address format").required("Required"),
    password: string()
      .min(8, "Password must be 8 characters at least")
      .required("Required"),
  });

  const onChangeStateUpdate = (e: ChangeEvent<HTMLInputElement>) => {
    setFormInputState({ ...formInputState, [e.target.name]: e.target.value });
  };

  return (
    <Container fluid className="d-flex justify-content-center">
      <Col className="d-flex flex-column" sm="8">
        <h1 className="mt-4">Sign Up</h1>
        <Formik
          enableReinitialize
          initialValues={{
            email: "",
            username: "",
            password: "",
            status: "idle",
          }}
          validationSchema={SignUpFormSchema}
          onSubmit={async (values, { setSubmitting }) => {
            console.log("values :", values);
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
                    Sign Up
                  </ModeButton>
                  <ModeButton
                    className="mt-4"
                    variant="outline-dark"
                    onClick={() => state.setFormState("signIn")}
                  >
                    Wait, go back
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
