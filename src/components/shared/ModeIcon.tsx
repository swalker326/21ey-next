import {
  FontAwesomeIcon,
  FontAwesomeIconProps,
} from "@fortawesome/react-fontawesome";
import React, { ForwardedRef, ForwardRefExoticComponent } from "react";

import { useAppContext } from "../../context/state";

export const ModeIcon = React.forwardRef<HTMLAnchorElement, FontAwesomeIconProps>((props, ref) => {
  const state = useAppContext();
  return (
    <a ref={ref} href={props.href} className={props.className}>
      <FontAwesomeIcon
        onClick={props.onClick}
        style={props.style}
        size={props.size}
        icon={props.icon}
        color={
          props.color ? props.color : state.theme.colorMode === "dark" ? "light" : "dark"
        }
      />
    </a>
  );
});
ModeIcon.displayName = "ModeButton";
