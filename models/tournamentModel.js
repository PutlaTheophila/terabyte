import mongoose from "mongoose";

const tournamentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  participants: {
    type: Number,
    required: true,
  },
  sport: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ['Completed', 'Ongoing', 'Upcoming'], // Restricting to valid statuses
  },
  description: {
    type: String,
    required: true,
  },
  schedule: [
    {
      date: {
        type: Date,
        required: true,
      },
      events: {
        type: [String],
        required: true,
      },
    },
  ],
  results: {
    boys: {
      winner: {
        name: { type: String, required: true },
        image: { type: String },
        score: { type: String, required: true },
      },
      runnerUp: {
        name: { type: String, required: true },
        image: { type: String },
        score: { type: String, required: true },
      },
    },
    girls: {
      winner: {
        name: { type: String, required: true },
        image: { type: String },
        score: { type: String, required: true },
      },
      runnerUp: {
        name: { type: String, required: true },
        image: { type: String },
        score: { type: String, required: true },
      },
    },
  },
  matches: [
    {
      team1: { type: String, required: true },
      team2: { type: String, required: true },
      score: { type: String, required: true },
      stage: { type: String, required: true },
    },
  ],
}, { timestamps: true });

const Tournament = mongoose.model('Tournament', tournamentSchema);

export default Tournament;



// const tournament = {
//     id: 1,
//     name: "Inter-College Basketball Championship 2023",
//     date: "2023-07-15",
//     endDate: "2023-07-20",
//     location: "Main Sports Arena, Central University",
//     participants: 16,
//     sport: "Basketball",
//     status: "Completed",
//     description: "The annual Inter-College Basketball Championship brings together the best college teams for an intense week of competition. Teams battle it out in a knockout format to be crowned the champions.",
//     schedule: [
//       { date: "2023-07-15", events: ["Opening Ceremony", "Preliminary Rounds"] },
//       { date: "2023-07-16", events: ["Quarter Finals"] },
//       { date: "2023-07-18", events: ["Semi Finals"] },
//       { date: "2023-07-20", events: ["Finals", "Closing Ceremony"] },
//     ],
//     results: {
//       boys: {
//         winner: { name: "Riverside College", image: "https://avatarfiles.alphacoders.com/130/thumb-1920-130018.jpg", score: "78-72" },
//         runnerUp: { name: "Hillside University", image: "https://avatarfiles.alphacoders.com/130/thumb-1920-130018.jpg", score: "72-78" },
//       },
//       girls: {
//         winner: { name: "Lakeview Institute", image: "https://avatarfiles.alphacoders.com/130/thumb-1920-130018.jpg", score: "65-60" },
//         runnerUp: { name: "Mountainview College", image: "https://avatarfiles.alphacoders.com/130/thumb-1920-130018.jpg", score: "60-65" },
//       },
//     },
//     matches: [
//       { team1: "Riverside College", team2: "Oakwood University", score: "82-75", stage: "Quarter Final" },
//       { team1: "Hillside University", team2: "Pinecrest College", score: "79-68", stage: "Quarter Final" },
//       { team1: "Lakeview Institute", team2: "Seaview Academy", score: "71-69", stage: "Semi Final" },
//       { team1: "Mountainview College", team2: "Valley Tech", score: "77-73", stage: "Semi Final" },
//     ],
//   };
