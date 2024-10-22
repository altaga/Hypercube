"use client";
import { createTheme, ThemeProvider } from "@mui/material";
import { light } from "@mui/material/styles/createPalette";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { CookiesProvider } from "react-cookie";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const theme = createTheme({
  palette: {
    white: {
      main: "#FFFFFF",
    },
    hypercube: {
      main: "#03cadf",
      light: "#0292a2",
      dark: "#025f6b",
    },
  },
});

export default function Providers({ children }) {
  return (
    <React.Fragment>
      <ThemeProvider theme={theme}>
        <CookiesProvider defaultSetOptions={{ path: "/" }}>
          <ToastContainer />
          <div className="container">{children}</div>
        </CookiesProvider>
      </ThemeProvider>
    </React.Fragment>
  );
}
