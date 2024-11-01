"use client";
import { getCookie, setCookie } from "@/api/cookies";
import { getCube } from "@/api/cubesInfo";
import { getSensorData } from "@/api/sensor";
import { Button, ButtonGroup } from "@mui/material";
import { Gauge, gaugeClasses } from "@mui/x-charts";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

function append(array, newItem) {
    // Check if the item exists in the array by some unique property (e.g., 'id')
    const exists = array.some(item => item.id === newItem.id);
    // If it doesn't exist, push it to the array
    if (!exists) {
      array.push(newItem);
    }
  }

function existsInArray(arr, key, value) {
  return arr.some((item) => item[key] === value);
}

function calculateDewPoint(temperature, humidity) {
  const a = 17.27;
  const b = 237.7;

  // Calculate alpha
  const alpha =
    (a * temperature) / (b + temperature) + Math.log(humidity / 100);

  // Calculate dew point
  const dewPoint = (b * alpha) / (a - alpha);
  return dewPoint;
}

function calculateAQI(eCO2, TVOC) {
  // Constants for weights
  const w1 = 0.6; // Weight for eCO2
  const w2 = 0.4; // Weight for TVOC

  // Normalize eCO2
  const normalizedECO2 = (eCO2 - 400) / (60000 - 400);

  // Normalize TVOC
  const normalizedTVOC = (TVOC - 0) / (60000 - 0);

  // Calculate AQI
  const AQI = w1 * normalizedECO2 + w2 * normalizedTVOC;

  // Scale AQI to a 0-100 range
  const scaledAQI = AQI * 100;

  return scaledAQI;
}

export default function CubePage({ params }) {
  // Check User
  const [user, _] = useState(getCookie("user"));
  const [cube, setCube] = useState({
    id: params.cubeId,
    name: "",
    description: "",
    points: 0,
  });
  const [points, setPoints] = useState(getCookie("points"));
  const [pointsFlag, setPointsFlag] = useState(false);
  const [stage, setStage] = useState(0);
  // Temperature Gauge
  const [fillTemp, setFillTemp] = useState("#52b202");
  const [gaugeDataTemp, setGaugeDataTemp] = useState(24);
  // Humidity Gauge
  const [fillHumidity, setFillHumidity] = useState("#52b202");
  const [gaugeDataHumidity, setGaugeDataHumidity] = useState(54);
  // Dew Point Gauge
  const [fillDewPoint, setFillDewPoint] = useState("#52b202");
  const [gaugeDataDewPoint, setGaugeDataDewPoint] = useState(11);
  // Air Quality Gauge
  const [fillAirQuality, setFillAirQuality] = useState("#52b202");
  const [gaugeDataAirQuality, setGaugeDataAirQuality] = useState(25);

  const appendCube = async () => {
    const cube = await getCube(params.cubeId);
    let cubes = getCookie("cubes");
    append(cubes, cube)
    setCookie("cubes", cubes);
  };

  const setupCube = async (cubeId) => {
    const cube = await getCube(cubeId);
    setCube(cube);
  };

  useEffect(() => {
    setupCube(params.cubeId);
    const cubes = getCookie("cubes");
    if(cubes === null) {
      setCookie("cubes", []);
    }
    setPointsFlag(existsInArray(getCookie("cubes"), "id", params.cubeId));
    checkData(params.cubeId);
    let interval = setInterval(() => {
      checkData(params.cubeId);
    }, 15000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  const changeGaugeDataTemp = () => {
    if (gaugeDataTemp >= 25) {
      setFillTemp("#FF4500");
    } else if (gaugeDataTemp < 25 && gaugeDataTemp >= 10) {
      setFillTemp("#32CD32");
    } else if (gaugeDataTemp < 10) {
      setFillTemp("#00BFFF");
    }
  };

  useEffect(() => {
    changeGaugeDataTemp();
  }, [gaugeDataTemp]);

  const changeGaugeDataHumidity = () => {
    if (gaugeDataHumidity >= 60) {
      setFillHumidity("#FF4500");
    } else if (gaugeDataHumidity < 60 && gaugeDataHumidity >= 30) {
      setFillHumidity("#32CD32");
    } else if (gaugeDataHumidity < 30) {
      setFillHumidity("#FF4500");
    }
  };

  useEffect(() => {
    changeGaugeDataHumidity();
  }, [gaugeDataHumidity]);

  const changeGaugeDataDewPoint = () => {
    if (gaugeDataDewPoint >= 22) {
      setFillDewPoint("#FF4500");
    } else if (gaugeDataDewPoint >= 20) {
      setFillDewPoint("#FF8C00");
    } else if (gaugeDataDewPoint >= 17) {
      setFillDewPoint("#FFD700");
    } else if (gaugeDataDewPoint >= 14) {
      setFillDewPoint("#32CD32");
    } else if (gaugeDataDewPoint >= 10) {
      setFillDewPoint("#00BFFF");
    } else {
      setFillDewPoint("#1E90FF");
    }
  };

  useEffect(() => {
    changeGaugeDataDewPoint();
  }, [gaugeDataDewPoint]);

  const changeGaugeDataAirQuality = () => {
    if (gaugeDataAirQuality < 33) {
      setFillAirQuality("#32CD32");
    } else if (gaugeDataAirQuality >= 33 && gaugeDataAirQuality < 66) {
      setFillAirQuality("#FFFF00");
    } else if (gaugeDataAirQuality >= 66) {
      setFillAirQuality("#FF4500");
    }
  };

  useEffect(() => {
    changeGaugeDataAirQuality();
  }, [gaugeDataAirQuality]);

  const checkData = async (cubeId) => {
    const { result: data } = await getSensorData(cubeId);
    console.log(data);
    setGaugeDataTemp(data.aTemperature);
    setGaugeDataHumidity(data.aHumidity);
    setGaugeDataDewPoint(calculateDewPoint(data.aTemperature, data.aHumidity));
    setGaugeDataAirQuality(calculateAQI(data.aECO2, data.aTVOC));
  };

  return (
    <div className="sensor-page">
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        {stage === 0 && (
          <>
            <div className="sensor-text">You Found a Hypercube!</div>
            <div className="sensor-title">Zone: {cube.name}</div>
            <div className="sensor-description">{cube.description}</div>
            {!pointsFlag && (
              <>
                <div className="sensor-points">
                  You earn {cube.points} Hyperpoints
                </div>
                <Button
                  onClick={() => {
                    appendCube();
                    setCookie("points", points + cube.points);
                    setPoints(points + cube.points);
                    setPointsFlag(true);
                    toast.success("You earned 150 Hyperpoints!", {
                      position: "top-center",
                    });
                  }}
                  variant="contained"
                  style={{ fontSize: "1.5rem", margin: "10px 0px" }}
                  color="white"
                >
                  Redeem Hyperpoints
                </Button>
              </>
            )}
          </>
        )}
        {stage === 1 && (
          <>
            <div className="user-title">Zone Environment</div>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                height: "100%",
                width: "100%",
                justifyContent: "space-evenly",
                alignItems: "center",
              }}
            >
              <div className="gauge-container">
                <div className="gauge-title">Temperature</div>
                <Gauge
                  valueMax={40}
                  valueMin={0}
                  value={gaugeDataTemp}
                  startAngle={-110}
                  endAngle={110}
                  sx={{
                    [`& .${gaugeClasses.valueText}`]: {
                      fontSize: 28,
                      fontFamily: "Roboto Mono, sans-serif",
                      transform: "translate(0px, 0px)",
                    },
                    [`& .${gaugeClasses.valueArc}`]: {
                      fill: fillTemp,
                    },
                  }}
                  text={({ value }) => `${parseInt(value)}ºC`}
                />
              </div>
              <div className="gauge-container">
                <div className="gauge-title">Humidity</div>
                <Gauge
                  valueMax={100}
                  valueMin={0}
                  value={gaugeDataHumidity}
                  startAngle={-110}
                  endAngle={110}
                  sx={{
                    [`& .${gaugeClasses.valueText}`]: {
                      fontSize: 28,
                      fontFamily: "Roboto Mono, sans-serif",
                      transform: "translate(0px, 0px)",
                    },
                    [`& .${gaugeClasses.valueArc}`]: {
                      fill: fillHumidity,
                    },
                  }}
                  text={({ value }) => `${parseInt(value)}%`}
                />
              </div>
              <div className="gauge-container">
                <div className="gauge-title">Dew Point</div>
                <Gauge
                  valueMax={100}
                  valueMin={0}
                  value={gaugeDataDewPoint}
                  startAngle={-110}
                  endAngle={110}
                  sx={{
                    [`& .${gaugeClasses.valueText}`]: {
                      fontSize: 28,
                      fontFamily: "Roboto Mono, sans-serif",
                      transform: "translate(0px, 0px)",
                    },
                    [`& .${gaugeClasses.valueArc}`]: {
                      fill: fillDewPoint,
                    },
                  }}
                  text={({ value }) => `${parseInt(value)}ºC`}
                />
              </div>
              <div className="gauge-container">
                <div className="gauge-title">Air Quality</div>
                <Gauge
                  valueMax={100}
                  valueMin={0}
                  value={gaugeDataAirQuality}
                  startAngle={-110}
                  endAngle={110}
                  sx={{
                    [`& .${gaugeClasses.valueText}`]: {
                      fontSize: 28,
                      fontFamily: "Roboto Mono, sans-serif",
                      transform: "translate(0px, 0px)",
                    },
                    [`& .${gaugeClasses.valueArc}`]: {
                      fill: fillAirQuality,
                    },
                  }}
                  text={({ value }) => {
                    if (value < 33) {
                      return `Good`;
                    } else if (value < 66) {
                      return `Moderate`;
                    } else {
                      return `Unhealthy`;
                    }
                  }}
                />
              </div>
            </div>
          </>
        )}
      </div>
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
          Overview
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
          Status
        </Button>
      </ButtonGroup>
    </div>
  );
}
