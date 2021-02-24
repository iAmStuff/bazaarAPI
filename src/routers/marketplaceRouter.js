import { Router } from 'express';
import MarketplaceModel from '../models/marketplaceModel';
const router = Router();

router
  .route('/')
  .get(async (req, res, next) => {
    try {
      const marketplaces = await MarketplaceModel.find();
      return res.send(marketplaces);
    } catch (e) {
      next(e);
    }
  })
  .post(async (req, res, next) => {
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
      await marketplace.save();

      return res
        .status(201)
        .json({ success: true, type: 'POST', data: { _id: marketplace._id } });
    } catch (e) {
      next(e);
    }
  });

router
  .route('/:id')
  .get(async (req, res, next) => {
    const id = req.params.id;

    const marketExists = await MarketplaceModel.findById(id);
    if (marketExists == null) {
      return res.status(404).json({ error: 'Route not found' });
    }
    return res.status(200).send(marketExists);
  })
  .put(async (req, res, next) => {
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
        return res.status(400).json({ error: 'Route not found' });
      }

      delete marketplace.__v;
      return res
        .status(200)
        .json({ success: true, type: 'PUT', data: marketplace });
    } catch (e) {
      next(e);
    }
  })
  .delete(async (req, res, next) => {
    try {
      const { params } = req;

      const marketplace = await MarketplaceModel.findByIdAndDelete(params.id);
      if (marketplace == null) {
        return res.status(400).json({ error: 'Route not found' });
      }

      return res.status(200).json({ success: true, type: 'DELETE' });
    } catch (e) {
      next(e);
    }
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
export default router;
