"use client";
import { createTheme, ThemeProvider } from "@mui/material";
import React from "react";
import { CookiesProvider } from "react-cookie";

const theme = createTheme({
  palette: {
    white: {
      main: "#FFFFFF",
    },
  },
});

export default function Providers({ children }) {
  return (
    <React.Fragment>
      <ThemeProvider theme={theme}>
        <CookiesProvider defaultSetOptions={{ path: "/" }}>
          {children}
        </CookiesProvider>
      </ThemeProvider>
    </React.Fragment>
  );
}
