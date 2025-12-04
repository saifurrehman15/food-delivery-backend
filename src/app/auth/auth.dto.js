import joi from "joi";

const userSchemaRegister = joi.object({
  user_name: joi.string().required(),
  email: joi.string().email().required(),
  password: joi.string().length(6).required(),
});

const userSchemaLogin = joi.object({
  email: joi.string().email().required(),
  password: joi.string().length(6).required(),
});

export { userSchemaLogin, userSchemaRegister };
