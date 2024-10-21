"use client";
import { createTheme, ThemeProvider } from "@mui/material";
import { light } from "@mui/material/styles/createPalette";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { CookiesProvider } from "react-cookie";

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
      <div className="my-header">
        <div className="header-logo">
          <Link href="/">
            <Image
              src={"/assets/logo.png"}
              alt="Hypercube Logo"
              priority
              layout="fill"
              objectFit="cover"
            />
          </Link>
        </div>
        <div className="header-name">
          <Link href="/">
            <Image
              src={"/assets/name.png"}
              alt="Hypercube Logo"
              priority
              layout="fill" // Makes the image fill the wrapper while keeping aspect ratio
              objectFit="cover" // Ensures the image covers the whole area
            />
          </Link>
        </div>
      </div>
      <ThemeProvider theme={theme}>
        <CookiesProvider defaultSetOptions={{ path: "/" }}>
          <div className="container">{children}</div>
        </CookiesProvider>
      </ThemeProvider>
    </React.Fragment>
  );
}
