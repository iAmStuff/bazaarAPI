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
    return res.send(marketplaces);
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
    const marketExists = await MarketplaceModel.findOne({ name: body.name });
    if (marketExists != null) {
      return res.status(400).json({
        error:
          'Duplicate marketplace: Marketplace with same name already exists',
      });
    }
    const marketplace = new MarketplaceModel(body);
    console.log(marketplace);
    await marketplace.save();

    return res
      .status(201)
      .json({ success: true, type: 'POST', data: { _id: marketplace._id } });
  } catch (e) {
    console.error(e);
    return res.status(500).send(e);
  }
});

server.put('/api/marketplaces/:id', async (req, res) => {
  try {
    const { body, params } = req;

    // check for id ... bogus code?
    if (!params.id) {
      return res.status(400).json({ error: 'Marketplace ID required' });
    }

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
    const marketplace = await MarketplaceModel.findByIdAndUpdate(
      params.id,
      body,
      {
        new: true,
        lean: true,
      }
    );
    if (marketplace == null) {
      return res.status(400).json({
        error: 'Bad ID: Marketplace with specified ID does not exist',
      });
    }

    delete marketplace.__v;
    return res
      .status(420)
      .json({ success: true, type: 'PUT', data: marketplace });
  } catch (e) {
    console.error(e);

    if (e.kind == 'ObjectId' && e.path == '_id') {
      return res.status(400).json({ error: 'Invalid ID parameter' });
    }

    return res.status(500).send(e);
  }
});

server.delete('/api/marketplaces/:id', async (req, res) => {
  try {
    const { params } = req;

    const marketplace = await MarketplaceModel.findByIdAndDelete(params.id);
    if (marketplace == null) {
      return res.status(400).json({
        error: 'Bad ID: Marketplace with specified ID does not exist',
      });
    }

    return res.status(200).json({ success: true, type: 'DELETE' });
  } catch (e) {
    console.error(e);

    if (e.kind == 'ObjectId' && e.path == '_id') {
      return res.status(400).json({ error: 'Invalid ID parameter' });
    }

    return res.status(500).send(e);
  }
});

server.use('*', (req, res) => {
  return res.status(404).json({ error: 'Route not found' });
});

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
