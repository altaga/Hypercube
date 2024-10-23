"use client";
import { getCookie } from "@/api/cookies";
import { getCubes, getCubeStates } from "@/api/cubesInfo";
import { getOffer } from "@/api/offersInfo";
import EmailIcon from "@mui/icons-material/Email";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import ScoreboardIcon from "@mui/icons-material/Scoreboard";
import WeekendIcon from "@mui/icons-material/Weekend";
import { Button, ButtonGroup } from "@mui/material";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function UserPage({ params }) {
  // Check User
  const [user, _] = useState(getCookie("user"));
  const [room, __] = useState(getCookie("room"));
  const [cubes, setCubes] = useState([]);
  const [cubeStates, setCubeStates] = useState([]);
  const [points, ____] = useState(getCookie("points"));
  const [offers, setOffers] = useState([]);
  const [stage, setStage] = useState(0);

  const getOffers = async () => {
    const offers = await getOffer(getCookie("points"));
    setOffers(offers);
  };

  const getAllCubes = async () => {
    const cubes = await getCubes();
    const cubeStates = await getCubeStates();
    setCubeStates(cubeStates);
    setCubes(cubes);
  };

  useEffect(() => {
    getAllCubes();
  }, []);

  return (
    <div className="user-page">
      {stage === 0 && (
        <>
          {cubes.map((cube, index) => (
            <div key={cube.id + index} className="user-card">
              <div className="user-text">
                Zone:
                <br />
                {cube.name}
              </div>
              <div
                className="separator"
                style={{
                  backgroundColor: "#777777",
                  marginTop: "10px",
                  marginBottom: "10px",
                }}
              />
              <div className="user-text" style={{ fontSize: "1.4rem" }}>
                Detections:
              </div>
              {cubeStates[index]?.data.detections.map((detection, index) => (
                <div key={detection + index} className="user-description">- {detection}</div>
              ))}
            </div>
          ))}
          <p />
        </>
      )}
      {stage === 1 && (
        <>
          <div className="user-title">Cubes Available</div>
          <div className="cube-card">
            {cubes.map((cube, index) => (
              <div
                className="cube-item"
                key={cube.id}
                onClick={() => (window.location.href = `/cube/${cube.id}`)}
              >
                <img
                  src={
                    (cubeStates[index]?.data.risky
                      ? "/assets/cubeWeapon.png"
                      : cubeStates[index]?.data.fallen
                      ? "/assets/cubeFall.png"
                      : "/assets/cubeOk.png") ?? "/assets/cubeOk.png"
                  }
                  alt="Hypercube Logo"
                  width={"100%"}
                  height={"100%"}
                />
                <div className="cube-description-admin">{cube.name}</div>
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
                  style={{
                    marginRight: "10px",
                    color: offer.color,
                    fontSize: "8rem",
                  }}
                ></LocalOfferIcon>
                <div className="cube-description-admin">{offer.name}</div>
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
            fontSize: "1rem",
            margin: "10px 0px",
            backgroundColor: stage === 0 && "white",
            color: stage === 0 && "black",
          }}
        >
          Detections
        </Button>
        <Button
          onClick={() => setStage(1)}
          style={{
            fontSize: "1rem",
            margin: "10px 0px",
            backgroundColor: stage === 1 && "white",
            color: stage === 1 && "black",
          }}
        >
          Cubes
        </Button>
      </ButtonGroup>
    </div>
  );
}
