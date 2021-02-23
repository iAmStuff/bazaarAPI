import express from 'express';
import { connect, disconnect } from './database';
import MarketplaceModel from './models/marketplaceModel';
import marketplaceRouter from './routers/marketplaceRouter';

connect();
const server = express();
const PORT = 5000;
server.use(express.json());

server.use('/api/marketplaces', marketplaceRouter);

server.use('*', (req, res) => {
  return res.status(404).json({ error: 'Route not found' });
});

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
