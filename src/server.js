import express from 'express';
import { Mongoose } from 'mongoose';
import { connect, disconnect } from './database';
import Books from './models/bookModel';

connect();
const server = express();

const PORT = 5000;

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

server.get('/books', async (req, res) => {
  try {
    const books = await Books.find();
    console.log(books);
    return res.json(books);
  } catch (e) {
    console.error(e);
    return res.status(500).send(e);
  }
});
