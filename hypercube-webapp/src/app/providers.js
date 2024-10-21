"use client";
import { createTheme, ThemeProvider } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
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
      <div className="my-header">
        <div className="header-logo">
          <Link href="">
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
          <Image
            src={"/assets/name.png"}
            alt="Hypercube Logo"
            priority
            layout="fill" // Makes the image fill the wrapper while keeping aspect ratio
            objectFit="cover" // Ensures the image covers the whole area
          />
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
