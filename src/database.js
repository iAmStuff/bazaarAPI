import mongoose from 'mongoose';

const address = 'localhost';
const PORT = 27017;
const database = 'bazaarAPI';
const opts = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
};

export const connect = () => {
  mongoose.connect(`mongodb://${address}:${PORT}/${database}`, opts, (err) => {
    if (err) {
      return console.error(err);
    }
    console.log('Connected to MongoDB');
  });
};

export const disconnect = () => {
  mongoose.disconnect();
};
