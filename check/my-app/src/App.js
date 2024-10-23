import logo from "./logo.svg";
import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [image, setImage] = useState(0);
  const [image2, setImage2] = useState(0);
  const [image3, setImage3] = useState(0);
  let interval = null;
  let interval2 = null;

  useEffect(() => {
    interval = setInterval(() => {
      analyze();
    },250);
    interval2 = setInterval(() => {
      feed();
    },50)
    return () => {
      clearInterval(interval)
      clearInterval(interval2)
    }
  }, []);

  const analyze = () => {
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch("http://192.168.1.224:3000/analyze", requestOptions)
      .then((response) => response.json())
      .then((res) => {
        setImage(res.result.imagePoses);
        setImage2(res.result.imageYolo);
      })
      .catch((error) => console.error(error));
  };

  const feed = () => {
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };
    fetch("http://192.168.1.224:3000/feed", requestOptions)
      .then((response) => response.json())
      .then((res) => {
        setImage3(res.result);
      })
      .catch((error) => console.error(error));
  };
  return (
    <div className="App">
      <header className="App-header">
        <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", height: "100vh", width: "100vw" }}>
          <img src={"data:image/jpg;base64," + image} />
          <img src={"data:image/jpg;base64," + image2} />
          <img src={"data:image/jpg;base64," + image3} />
        </div>
      </header>
    </div>
  );
}

export default App;
