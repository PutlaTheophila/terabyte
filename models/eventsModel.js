import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  images: {
    type: [String], // Array of image URLs
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  sport: {
    type: String,
    required: true,
  },
  participants: {
    type: String,
    required: true,
  },
  schedule: {
    type: String,
    required: true,
  },
  organizer: {
    type: String,
    required: true,
  },
});

const Event = mongoose.model('Event', eventSchema);

export default Event;
