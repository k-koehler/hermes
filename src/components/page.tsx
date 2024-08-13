import React, { useState, FormEvent } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { HTMLAttributes, PropsWithChildren } from "react";
import styled from "@emotion/styled";
import { AppBar, Toolbar, IconButton, InputBase, Box } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import { Home, Search } from "@mui/icons-material";

const StyledMain = styled.main`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  padding: 1rem 2rem;
`;

const StyledInputBase = styled(InputBase)`
  color: inherit;
  width: 100%;
`;

const SearchWrapper = styled(Box)`
  position: relative;
  border-radius: 4px;
  background-color: rgba(255, 255, 255, 0.15);
  &:hover {
    background-color: rgba(255, 255, 255, 0.25);
  }
  margin-left: 0;
  width: 100%;
  @media (min-width: 600px) {
    margin-left: 1rem;
    width: auto;
  }
`;

const SearchIconWrapper = styled.div`
  padding: 0 16px;
  height: 100%;
  position: absolute;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledInputBaseWithPadding = styled(StyledInputBase)`
  padding-left: 1rem;
  input {
    padding-left: 2.5rem;
    transition: width 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
    width: 100%;
    @media (min-width: 600px) {
      width: 12ch;
      &:focus {
        width: 20ch;
      }
    }
  }
`;

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

interface Props extends PropsWithChildren<HTMLAttributes<HTMLDivElement>> {
  hideNavBar?: boolean;
}

export default function Page({ hideNavBar = false, ...props }: Props) {
  const [search, setSearch] = useState("");
  const router = useRouter();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const encodedSearch = encodeURIComponent(search);
    router.push(`/search?q=${encodedSearch}`);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      {!hideNavBar && (
        <AppBar position="static">
          <Toolbar sx={{ justifyContent: "space-between" }}>
            <Link href="/" passHref>
              <IconButton
                edge="start"
                color="primary"
                aria-label="home"
                component="a"
              >
                <Home />
              </IconButton>
            </Link>
            <form onSubmit={handleSubmit}>
              <SearchWrapper>
                <SearchIconWrapper>
                  <Search />
                </SearchIconWrapper>
                <StyledInputBaseWithPadding
                  placeholder="Search…"
                  inputProps={{ "aria-label": "search" }}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </SearchWrapper>
            </form>
          </Toolbar>
        </AppBar>
      )}
      <StyledMain {...props} />
    </ThemeProvider>
  );
}
