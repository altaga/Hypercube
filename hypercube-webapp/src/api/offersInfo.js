"use server";

// Array of offers for the guest, including experiences in Singapore and room upgrades
const offers = [
  {
    id: "00001",
    name: "ROOM UPGRADE",
    description:
      "Enjoy a luxurious stay with a complimentary room upgrade to our Deluxe Suite. Includes VIP check-in, free minibar, and late check-out.",
    points: 100,
    color: "#cd7f32", // Bronze
  },
  {
    id: "00002",
    name: "GOURMET EXPERIENCE",
    description:
      "An exclusive dining experience featuring a 5-course meal prepared by a world-renowned chef. Includes complimentary wine pairings for each course.",
    points: 400,
    color: "#c0c0c0", // Silver
  },
  {
    id: "00003",
    name: "SPA RETREAT",
    description:
      "A luxurious spa day package including a massage, facial, and access to private sauna and hot tubs.",
    points: 350,
    color: "#c0c0c0", // Silver
  },
  {
    id: "00004",
    name: "ADVENTURE DAY",
    description:
      "A thrilling day of adventure activities such as zip-lining, rock climbing, and water sports. Perfect for adrenaline seekers.",
    points: 300,
    color: "#cd7f32", // Bronze
  },
  {
    id: "00005",
    name: "CONCERT TICKETS",
    description:
      "Two front-row tickets to a live concert of your choice with backstage access to meet the performers.",
    points: 600,
    color: "#ffd700", // Gold
  },
  {
    id: "00006",
    name: "SKYLINE DINNER",
    description:
      "Experience a breathtaking view of the Singapore skyline with a fine dining experience on the rooftop of Marina Bay Sands.",
    points: 500,
    color: "#c0c0c0", // Silver
  },
  {
    id: "00007",
    name: "CITY TOUR",
    description:
      "Explore Singapore with a private guide, visiting iconic landmarks such as Gardens by the Bay, Sentosa Island, and Merlion Park.",
    points: 450,
    color: "#c0c0c0", // Silver
  },
  {
    id: "00008",
    name: "ROOM UPGRADE",
    description:
      "Upgrade to the Penthouse Suite with panoramic views, private butler service, and exclusive lounge access.",
    points: 700,
    color: "#ffd700", // Gold
  }
];

// Function to get an offer based on points available
export async function getOffer(points) {
  return new Promise((resolve, reject) => {
    try {
      // Filter offers that the guest can afford based on points
      const availableOffers = offers.filter((offer) => offer.points <= points);

      // Resolve with available offers or an empty array if no offers match
      resolve(availableOffers.length > 0 ? availableOffers : []);
    } catch (e) {
      resolve(null); // Handle error
    }
  });
}
