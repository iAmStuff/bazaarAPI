import mongoose from "mongoose";
const { Schema } = mongoose;

const model = new Schema({
  username: { type: String, required: true },
  userid: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  hint: { type: String },
  token: { type: String, unique: true },
});

export default mongoose.model("users", model);
