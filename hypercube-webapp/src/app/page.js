"use client";
import { deleteCookie, getCookie, setCookie } from "@/api/cookies";
import { Button, Input } from "@mui/material";
import { useState } from "react";

// Create a function to detect if the text is an email
const isEmail = (text) => {
  // Regular expression for email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(text);
};

export default function LandingPage() {
  const user = getCookie("user");
  const [inputValue, setInputValue] = useState("");
  return (
    <>
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
          {user ? (
            <Button
              onClick={() => {
                deleteCookie("user");
              }}
              variant="contained"
              color="hypercube"
              className="landing-button"
              style={{ marginTop: "20px" }}
            >
              Logout
            </Button>
          ) : (
            <>
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter your email"
                className="landing-input"
              />
              <Button
                onClick={() => {
                  if (!isEmail(inputValue)) {
                    alert("Please enter a valid email address");
                  } else {
                    setCookie("user", inputValue);
                  }
                }}
                variant="contained"
                color="hypercube"
                className="landing-button"
              >
                Login with Email
              </Button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
