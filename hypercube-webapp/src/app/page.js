"use client";
import { getCookie, setCookie } from "@/api/cookies";
import { Button, Input } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function LandingPage() {
  const [inputValue, setInputValue] = useState("");
  const [inputValue2, setInputValue2] = useState("");

  useEffect(() => {
    const user = getCookie("user");
    console.log(user);
    if (user) {
      window.location.href = "/user/" + user;
    }
  }, []);

  return (
    <>
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
      <div className="landing-page" />
      <div className="landing-container">
        <div className="landing-text">
          <div>{"Welcome to"}</div>
          <div>{"Hypercube"}</div>
        </div>
        <div className="separator" />
        <div className="landing-description">
          Hypercube provides security and ensures you have an exceptional
          experience, leveraging sensors, AI, and loyalty points to offer safety
          and exclusive benefits throughout your stay.
        </div>
        <div className="landing-content">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter your email"
            className="landing-input"
          />
          <Input
            value={inputValue2}
            onChange={(e) => setInputValue2(e.target.value)}
            placeholder="Enter your room number"
            className="landing-input"
            style={{ marginBottom: "20px" }}
          />
          <Button
            onClick={() => {
              setCookie("room", inputValue2);
              setCookie("user", inputValue);
              setCookie("cubes", []);
              setCookie("points", 0);
              setTimeout(() => {
                window.location.href = "/user/" + inputValue;
              }, 300);
            }}
            variant="contained"
            color="hypercube"
            className="landing-button"
          >
            Login with Email
          </Button>
        </div>
      </div>
    </>
  );
}
