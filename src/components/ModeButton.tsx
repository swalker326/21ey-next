import React from "react";
import { Button, ButtonProps } from "react-bootstrap";
import { useAppContext } from "../context/state";

export const ModeButton: React.FC<ButtonProps> = (props) => {
  const theme = useAppContext();
  const { children } = props;
  const variant = props.variant?.includes("outline")
    ? `outline-${theme.mode === 'dark' ? 'dark' : 'secondary'}`
    : theme.mode === "light" ? "secondary" : "dark";
  return (
    <Button {...props} variant={variant}>
      {children}
    </Button>
  );
};
