"use server";

const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

export async function getSensorData(cubeId) {
  const raw = JSON.stringify({
    cubeId,
  });
  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };
  const response = await fetch(process.env.GOOGLE_CLOUD_API + `/getSensorData`, requestOptions);
  const data = await response.json();
  return data;
}
