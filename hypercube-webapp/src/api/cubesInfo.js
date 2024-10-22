"use server";

const cubes = [
  {
    id: "00001",
    name: "CONNECT",
    description:
      "A venue space that can accommodate up to 80 guests in theater style seating! With modern furnishings and bold pops of color throughout, this space is designed to provide a fun and vibrant atmosphere.",
    points: 150,
  },
];

export async function getCube(cubeId) {
  return new Promise((resolve, reject) => {
    try {
      const obj = cubes.find((item) => item.id === cubeId);
      resolve(obj);
    } catch (e) {
      resolve(null);
    }
  });
}
