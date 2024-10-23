"use server";

const cubes = [
  {
    id: "00001",
    name: "CONNECT",
    description:
      "A venue space that can accommodate up to 80 guests in theater style seating! With modern furnishings and bold pops of color throughout, this space is designed to provide a fun and vibrant atmosphere.",
    points: 150,
  },
  {
    id: "00002",
    name: "WASH N HANG",
    description:
      "Dreary chores are a thing of the past. Load your laundry, then read, chat or chill with a beer while your clothes get cleaned.",
    points: 250,
  },
  {
    id: "00003",
    name: "BOND - KITCHEN",
    description:
      "Nothing brings people together like good food in the social kitchen - whip up culinary storms ora pick up new recipes from like-minded travelers from around the globe.",
    points: 350,
  },
  {
    id: "00004",
    name: "BURN - GYM",
    description:
      "Work up a sweat in lyf life-sized giant hamster wheel that functions as a quirky treadmill, or train up your core with our TRX bands. Gym-ing has never been so fun!",
    points: 150,
  },
  {
    id: "00005",
    name: "BOND - SEATING",
    description:
      "At BOND, we offer 2 seating options accommodate your needs: round table seating guests. for up to 24 guests and long table seating.",
    points: 250,
  },
  {
    id: "00006",
    name: "COLLAB",
    description:
      "Welcome to our boardroom style meeting room, designed to accommodate 12 guests. This room is perfect for small business meetings, interviews, and intimate gatherings.",
    points: 350,
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

export async function getCubeStates() {
  return new Promise((resolve, reject) => {
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch(
      "https://us-central1-hypercube-439201.cloudfunctions.net/getCubeStates",
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => resolve(result.result))
      .catch(() => resolve(null));
  });
}

export async function getCubes() {
  return new Promise((resolve, reject) => {
    try {
      resolve(cubes);
    } catch (e) {
      resolve(null);
    }
  });
}
