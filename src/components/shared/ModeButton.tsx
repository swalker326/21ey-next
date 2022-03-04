import React from "react";
import { Button, ButtonProps } from "react-bootstrap";
import { useAppContext } from "../../context/state";

export const ModeButton: React.FC<ButtonProps> = (props) => {
  const state = useAppContext();
  const { children } = props;
  const variant = props.variant?.includes("outline")
    ? `outline-${state.theme.colorMode === "dark" ? "dark" : "secondary"}`
    : state.theme.colorMode === "light"
    ? "secondary"
    : "dark";
  return (
    <Button {...props} variant={variant}>
      {children}
    </Button>
  );
};
