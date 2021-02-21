import express from 'express';
import { Mongoose } from 'mongoose';
import { connect, disconnect } from './database';
import MarketplaceModel from './models/marketplaceModel';

connect();
const server = express();

const PORT = 5000;

server.use(express.json());

server.get('/api/marketplaces', async (req, res) => {
  try {
    const marketplaces = await MarketplaceModel.find();
    console.log(marketplaces);
    return res.json(marketplaces);
  } catch (e) {
    console.error(e);
    return res.status(500).send(e);
  }
});

server.post('/api/marketplaces', async (req, res) => {
  try {
    const { body } = req;
    // check for required fields
    if (
      !body.hasOwnProperty('name') ||
      !body.hasOwnProperty('description') ||
      !body.hasOwnProperty('owner')
    ) {
      return res.status(400).json({
        error:
          'Marketplaces must include the following properties: name, description and owner',
      });
    }
    const isDuplicateName = await MarketplaceModel.findOne({ name: body.name });
    if (isDuplicateName != null) {
      return res.status(400).json({
        error:
          'Duplicate marketplace: Marketplace with same name already exists',
      });
    }
    const marketplace = new MarketplaceModel(body);
    console.log(marketplace);
    await marketplace.save();

    return res.status(201).send(marketplace._id);
  } catch (e) {
    console.error(e);
    return res.status(500).send(e);
  }
});

server.use('*', (req, res) => {
  return res.status(404).json({ error: 'Route not found' });
});

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
