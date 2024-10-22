"use client";
import { getCookie } from "@/api/cookies";
import { getSensorData } from "@/api/sensor";
import { Button, ButtonGroup } from "@mui/material";
import { Gauge, gaugeClasses } from "@mui/x-charts";
import Image from "next/image";
import { useEffect, useState } from "react";
import EmailIcon from "@mui/icons-material/Email";
import WeekendIcon from "@mui/icons-material/Weekend";
import ScoreboardIcon from "@mui/icons-material/Scoreboard";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import { getOffer } from "@/api/offersInfo";

export default function UserPage({ params }) {
  // Check User
  const [user, _] = useState(getCookie("user"));
  const [room, __] = useState(getCookie("room"));
  const [cubes, ___] = useState(getCookie("cubes"));
  const [points, ____] = useState(getCookie("points"));
  const [offers, setOffers] = useState([]);
  const [stage, setStage] = useState(2);

  const getOffers = async () => {
    const offers = await getOffer(getCookie("points"));
    setOffers(offers);
  };

  useEffect(() => {
    if (
      user === null ||
      room === null ||
      user !== decodeURIComponent(params.user)
    ) {
      window.location.href = "/";
    } else {
      getOffers();
    }
  }, []);

  return (
    <div className="user-page">
      {stage === 0 && (
        <>
          <div className="user-card">
            <Image
              src={"/assets/logo.png"}
              alt="Hypercube Logo"
              width={100}
              height={100}
            />
            <div className="user-text">Welcome</div>
            <div className="separator" style={{ backgroundColor: "#777777" }} />
            <div className="user-description">
              <EmailIcon style={{ marginRight: "5px" }}></EmailIcon> Email:{" "}
              {user}
            </div>
            <div className="user-description">
              <WeekendIcon style={{ marginRight: "10px" }}></WeekendIcon>
              Room: {room}
            </div>
            <div className="user-description">
              <ScoreboardIcon style={{ marginRight: "10px" }}></ScoreboardIcon>
              Points: {points}
            </div>
          </div>
        </>
      )}
      {stage === 1 && (
        <>
          <div className="user-title">Cubes Discovered</div>
          <div className="cube-card">
            {cubes.map((cube) => (
              <div
                className="cube-item"
                key={cube.id}
                onClick={() => (window.location.href = `/cube/${cube.id}`)}
              >
                <img
                  src={"/assets/logo.png"}
                  alt="Hypercube Logo"
                  width={"100%"}
                  height={"100%"}
                />
                <div className="cube-description">{cube.name}</div>
              </div>
            ))}
          </div>
        </>
      )}
      {stage === 2 && (
        <>
          <div className="user-title">Cubes Discovered</div>
          <div className="cube-card">
            {offers.map((offer) => (
              <div className="cube-item" key={offer.id}>
                <LocalOfferIcon
                  style={{ marginRight: "10px", color: offer.color, fontSize: "8rem" }}
                ></LocalOfferIcon>
                <div className="cube-description">{offer.name}</div>
              </div>
            ))}
          </div>
        </>
      )}
      <ButtonGroup
        color="white"
        size="large"
        variant="outlined"
        aria-label="Basic button group"
        fullWidth
      >
        <Button
          onClick={() => setStage(0)}
          style={{
            fontSize: "1.5rem",
            margin: "10px 0px",
            backgroundColor: stage === 0 && "white",
            color: stage === 0 && "black",
          }}
        >
          Profile
        </Button>
        <Button
          onClick={() => setStage(1)}
          style={{
            fontSize: "1.5rem",
            margin: "10px 0px",
            backgroundColor: stage === 1 && "white",
            color: stage === 1 && "black",
          }}
        >
          Cubes
        </Button>
        <Button
          onClick={() => setStage(2)}
          style={{
            fontSize: "1.5rem",
            margin: "10px 0px",
            backgroundColor: stage === 2 && "white",
            color: stage === 2 && "black",
          }}
        >
          Offers
        </Button>
      </ButtonGroup>
    </div>
  );
}
