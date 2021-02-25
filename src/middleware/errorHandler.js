import errorModel from '../models/errorModel.js';

const errorLogger = async (e) => {
  const { message, stack } = e;

  const errorLog = new errorModel({message: e.message, stack: e.stack});
  console.log(e);
  const log = await errorLog.save();
  console.log(log);
};

const errorHandler = (e, req, res, next) => {
  const error = e.message ? e.message : 'Something went horribly wrong!';

  errorLogger(e);

  return res.status(500).send(error);
};

export default errorHandler;
