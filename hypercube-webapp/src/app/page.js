"use client";
import { useCookies } from "react-cookie";
import { Button, Input } from "@mui/material";
import { useState } from "react";

// Create a function to detect if the text is an email
const isEmail = (text) => {
  // Regular expression for email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(text);
};

export default function LandingPage() {
  const [user, setUser] = useCookies(["user"]);
  const [inputValue, setInputValue] = useState("");
  return (
    <div className="landing-page">
      <div className="circle" />
      <div className="my-page">
        <div
          className="stage-text"
          style={{ marginTop: "20px", marginBottom: "30px" }}
        >
          Welcome to Hypercube
        </div>
        <div
          style={{
            backgroundColor: "white",
            height: "5px",
            width: "10%",
            alignSelf: "center",
          }}
        ></div>
        <div className="stage-description" style={{ fontSize: "20px", padding: "0px 40px" }}>
          Hypercube provides security and ensures you have an exceptional
          experience, leveraging sensors, AI, and loyalty points to offer safety
          and exclusive benefits throughout your stay.
        </div>
        <div
          style={{
            position: "absolute",
            display: "flex",
            flexDirection: "column",
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
            bottom: 20,
            gap: 20,
          }}
        >
          {user.user ? (
            <>
              <div className="stage-description">{user.user}</div>
              <Button
                onClick={() => {
                  setUser("user", null, { path: "/" });
                }}
                variant="outlined"
                color="primary"
                style={{
                  borderRadius: "10px",
                  width: "80%",
                  fontSize: "20px",
                  color: "black",
                  borderWidth: "1px",
                  borderColor: "black",
                }}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter your email"
                style={{
                  padding: "10px 20px",
                  fontSize: "20px",
                  width: "80%",
                  borderRadius: "10px",
                  backgroundColor: "white",
                }}
              />
              <Button
                onClick={() => {
                  if (!isEmail(inputValue)) {
                    alert("Please enter a valid email address");
                  } else {
                    setUser("user", inputValue, { path: "/" });
                  }
                }}
                variant="outlined"
                color="primary"
                style={{
                  borderRadius: "10px",
                  width: "80%",
                  fontSize: "20px",
                  color: "black",
                  borderWidth: "1px",
                  borderColor: "black",
                }}
              >
                Login with Email
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
