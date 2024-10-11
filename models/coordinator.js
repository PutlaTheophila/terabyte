import mongoose from "mongoose";

const playerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  program: {
    type: String,
    required: true,
  },
  branch: {
    type: String,
    required: true,
  },
});

const coordinatorSchema = new mongoose.Schema({
  sport: {
    type: String,
    required: true,
  },
  players: [playerSchema], // Array of players under the sport
});

const Coordinator = mongoose.model('Coordinator', coordinatorSchema);
export default Coordinator;


