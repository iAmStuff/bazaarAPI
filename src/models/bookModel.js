import mongoose from 'mongoose';
const { Schema } = mongoose;

const model = new Schema({
  title: { type: String, required: true, unique: true },
  genre: { type: String, required: true },
  Author: { type: String, required: true },
});

export default mongoose.model('Books', model, 'books');
