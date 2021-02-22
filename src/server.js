import express from 'express';
import { connect, disconnect } from './database';
import MarketplaceModel from './models/marketplaceModel';

connect();
const server = express();
const PORT = 5000;
server.use(express.json());

const errors = {
  badId: { error: 'Bad ID: Marketplace with specified ID does not exist' },
  noRoute: { error: 'Route not found' },
};

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

server.get('/api/marketplaces/:id', async (req, res) => {
  const id = req.params.id;

  const marketExists = await MarketplaceModel.findById(id);
  if (marketExists == null) {
    return res.status(404).json(errors.noRoute);
  }
  return res.status(200).send(marketExists);
});

server.post('/api/marketplaces', async (req, res) => {
  try {
    const { body } = req;

    // check for required fields
    const invalidBody = validateBody(body);
    if (invalidBody) {
      return res.status(400).json(invalidBody);
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
    const invalidBody = validateBody(body);
    if (invalidBody) {
      return res.status(400).json(invalidBody);
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
      return res.status(400).json(errors.badId);
    }

    delete marketplace.__v;
    return res
      .status(420)
      .json({ success: true, type: 'PUT', data: marketplace });
  } catch (e) {
    console.error(e);
    return res.status(500).send(e);
  }
});

server.delete('/api/marketplaces/:id', async (req, res) => {
  try {
    const { params } = req;

    const marketplace = await MarketplaceModel.findByIdAndDelete(params.id);
    if (marketplace == null) {
      return res.status(400).json(errors.badId);
    }

    return res.status(200).json({ success: true, type: 'DELETE' });
  } catch (e) {
    console.error(e);
    return res.status(500).send(e);
  }
});

server.use('*', (req, res) => {
  return res.status(404).json(errors.noRoute);
});

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

// declarations
const validateBody = (body) => {
  // returns null if no errors are found.
  // returns *something* if errors are found
  if (
    !body.hasOwnProperty('name') ||
    !body.hasOwnProperty('description') ||
    !body.hasOwnProperty('owner')
  ) {
    return {
      error:
        'Marketplaces must include the following properties: name, description and owner',
    };
  }
  return null;
};
