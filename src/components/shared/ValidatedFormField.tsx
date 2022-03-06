import { Field, FieldHookConfig, useField } from "formik";
import styled from "styled-components";

type ValidatedFormFieldType = FieldHookConfig<string> & {
  label?: string;
};

export const ValidatedFormField: React.FC<ValidatedFormFieldType> = ({
  label,
  ...props
}) => {
  const [field, meta] = useField(props);
  //field and props can both have an onchange, if an onchange is passed as a prop, that will be fired,
  //if no on change is passed to the component the field (formik default) onChange will be used.
  return (
    <div>
      <StyledField
        className={`${props.className ? props.className : ""} ${
          meta.error && meta.touched ? "error" : ""
        }`}
        {...field}
        {...props}
      />
      {meta.touched && meta.error ? (
        <ErrorContainer>{meta.error}</ErrorContainer>
      ) : null}
    </div>
  );
};

const ErrorContainer = styled.div`
  color: #ff000090;
`;
const StyledField = styled(Field)`
  border-radius: 4px;
  padding: 6px;
  border: 1px solid #66666640;
  &.error {
    background-color: #ff000030;
  }
  &:focus {
    outline: 1px solid #66666690;
  }
`;
