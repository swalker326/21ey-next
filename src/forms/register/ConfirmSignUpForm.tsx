import React, { ChangeEvent, Dispatch, SetStateAction } from "react";
import { Col, Container } from "react-bootstrap";
import { Formik, Form, Field } from "formik";
import { object, string } from "yup";
import { ModeButton } from "../../components/shared/ModeButton";
import { RegisterFormProps } from "./@types";
import { ValidatedFormField } from "../../components/shared/ValidatedFormField";

export const ConfirmSignUpForm = ({
  formInputState,
  setFormInputState,
  formSubmit,
}: RegisterFormProps) => {
  const ConfirmationFormSchema = object().shape({
    verificationCode: string().min(6).max(6),
  });
  const onChangeStateUpdate = (e: ChangeEvent<HTMLInputElement>) => {
    setFormInputState({ ...formInputState, [e.target.name]: e.target.value });
  };
  return (
    <Container fluid>
      <Col>
        <h1>Confirm Signup Here</h1>
        <Formik
          enableReinitialize
          initialValues={{
            verificationCode: formInputState.verificationCode,
          }}
          validationSchema={ConfirmationFormSchema}
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
                    marginLeft: 0,
                  }}
                >
                  <ValidatedFormField
                    id="verificationCode"
                    type="text"
                    name="verificationCode"
                    value={formInputState.verificationCode}
                    placeholder="Verification Code"
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      handleChange(event);
                      onChangeStateUpdate(event);
                    }}
                    style={{ margin: "6px 0", width: "100%" }}
                  />
                </div>
                <ModeButton type="submit" className="mt-4">
                  Sumbit
                </ModeButton>
              </Form>
            );
          }}
        </Formik>
      </Col>
    </Container>
  );
};
