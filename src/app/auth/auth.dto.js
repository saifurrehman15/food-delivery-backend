import joi from "joi";

const userSchemaRegister = joi.object({
  user_name: joi.string().required(),
  email: joi.string().email().required(),
});

const userSchemaLogin = joi.object({
  email: joi.string().email().required(),
});

export { userSchemaLogin, userSchemaRegister };
