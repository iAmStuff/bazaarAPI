const errorHandler = (err, req, res, next) => {
  const error = err.message ? err.message : 'Something went horribly wrong!';
  console.error(error);
  return res.status(500).send(error);
};

export default errorHandler;
