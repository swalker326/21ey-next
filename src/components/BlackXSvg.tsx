import * as React from "react";

const SvgComponent = (props:any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 96 96"
    fill="CurrentColor"
    xmlSpace="preserve"
    {...props}
  >
    <path d="M96 14 82 0 48 34 14 0 0 14l34 34L0 82l14 14 34-34 34 34 14-14-34-34z" />
  </svg>
);

export default SvgComponent;
