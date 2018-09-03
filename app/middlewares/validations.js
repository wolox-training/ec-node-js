const Joi = require('joi'),
  errors = require('../errors');

const validateBody = schema => (req, res, next) => {
  Joi.validate(req.body, schema, { abortEarly: false }) // return all errors a payload contains, not just the first one Joi finds
    .then(() => next())
    .catch(err => {
      next(errors.requestError(err.details));
    });
};

const userValidator = validateBody(
  Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string()
      .email()
      .regex(/@wolox\.(co|com|cl|com.ar)$/, { name: 'Wolox e-mail' })
      .required(),
    password: Joi.string()
      .regex(/^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/, { name: 'Alphanumeric' })
      .min(8)
      .required()
  })
);

module.exports = {
  userValidator
};
