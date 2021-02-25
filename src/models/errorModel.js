import mongoose from "mongoose";
const { Schema } = mongoose;

const model = new Schema({
  date: { type: Date, default: Date.now },
  message: { type: String },
  stack: { type: String, timestamps: true },
});

export default mongoose.model("errors", model, "errors");
