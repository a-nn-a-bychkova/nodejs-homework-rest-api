const Joi = require("joi");
const { Subscription } = require("../../../helpers/constants");
const schemaRegisterUser = Joi.object({
  name: Joi.string().alphanum().min(3).max(30),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .required(),
  password: Joi.string().min(6).max(20).required(),
  subscription: Joi.string().valid(
    Subscription.FREE,
    Subscription.PRO,
    Subscription.PREMIUM
  ),
});
const schemaLoginUser = Joi.object({
  name: Joi.string().alphanum().min(3).max(30),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .required(),
  password: Joi.string().min(6).max(20).required(),
  subscription: Joi.string().valid(
    Subscription.FREE,
    Subscription.PRO,
    Subscription.PREMIUM
  ),
});

const schemaUpdateUserSubscription = Joi.object({
  subscription: Joi.string()
    .valid(Subscription.FREE, Subscription.PRO, Subscription.PREMIUM)
    .required(),
});

const validate = (schema, obj, next) => {
  const { error } = schema.validate(obj);
  if (error) {
    const [{ message }] = error.details;
    return next({
      status: 400,
      message: `Ошибка от Joi или другой валидационной библиотеки.Field: ${message.replace(
        /"/g,
        ""
      )}`,
    });
  }
  next();
};
module.exports.registerUser = (req, res, next) => {
  return validate(schemaRegisterUser, req.body, next);
};
module.exports.loginUser = (req, res, next) => {
  return validate(schemaLoginUser, req.body, next);
};
module.exports.updateSubscription = (req, res, next) => {
  return validate(schemaUpdateUserSubscription, req.body, next);
};
