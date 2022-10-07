const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode ? res.statusCode : 500;
  res.status(statusCode);
  const additionalErrors = { validationsErrors: { ...err.validationErrors } };
  res.json({
    message: err.message,
    ...additionalErrors,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = { errorHandler };
