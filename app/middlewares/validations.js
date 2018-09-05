const Joi = require('joi'),
  errors = require('../errors');

const validate = (attr, schema) => (req, res, next) => {
  Joi.validate(req[attr], schema, { abortEarly: false }) // return all errors a payload contains, not just the first one Joi finds
    .then(() => next())
    .catch(err => {
      next(errors.requestError(err.details));
    });
};

const emailValidation = Joi.string()
  .email()
  .regex(/@wolox\.(co|com|cl|com.ar)$/, { name: 'Wolox e-mail' })
  .required();

const passValidation = Joi.string()
  .regex(/^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/, { name: 'Alphanumeric' })
  .min(8)
  .required();

const userValidator = validate(
  'body',
  Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: emailValidation,
    password: passValidation
  })
);

const signinValidator = validate(
  'body',
  Joi.object({
    email: emailValidation,
    password: passValidation
  })
);

const paginateValidator = validate(
  'query',
  Joi.object({
    limit: Joi.number().integer(),
    page: Joi.number().integer()
  })
);

module.exports = {
  userValidator,
  signinValidator,
  paginateValidator
};
