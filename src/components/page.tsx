import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { HTMLAttributes, PropsWithChildren } from "react";
import styled from "@emotion/styled";

const StyledMain = styled.main`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  padding: 1rem 2rem;
`;

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

interface Props extends PropsWithChildren<HTMLAttributes<HTMLDivElement>> {}

export default function Page(props: Props) {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <StyledMain {...props} />
    </ThemeProvider>
  );
}
