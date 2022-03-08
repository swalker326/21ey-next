
export type BreakPointSizes = {
  xs: "0px",
  sm: "576px",
  md: "768px",
  lg: "992px",
  xl: "1200px",
  xxl: "1400px"
}

const mediaQuery = (maxWidth: number) :string =>
  "@media only screen and (max-width: "+maxWidth+"px)";

export const sizes = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1400
}

export const devices = {
  custom: mediaQuery,
  xs: mediaQuery(sizes.xs),
  sm: mediaQuery(sizes.xs),
  md: mediaQuery(sizes.md),
  lg: mediaQuery(sizes.lg),
  xl: mediaQuery(sizes.xl),
  xxl: mediaQuery(sizes.xxl),
}