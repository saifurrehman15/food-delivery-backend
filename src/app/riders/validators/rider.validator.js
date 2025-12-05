import Joi from "joi";

export const riderApplicationValidator = Joi.object({
  fullName: Joi.string().trim().min(2).required(),

  email: Joi.string().email().lowercase().required(),

  phone: Joi.string()
    .pattern(/^[0-9+\-\s()]+$/)
    .required(),

  dateOfBirth: Joi.date().required(),

  cnic: Joi.string()
    .trim()
    .pattern(/^[0-9]{5}-[0-9]{7}-[0-9]$/)
    .required(),

  address: {
    name: Joi.string().trim().required(),
    lat: Joi.number().required(),
    lng: Joi.number().required(),
  },

  city: Joi.string().trim().required(),

  vehicleType: Joi.string()
    .valid("motorcycle", "bicycle", "car", "scooter")
    .required(),

  vehicleModel: Joi.string().trim().required(),

  vehicleNumber: Joi.string().trim().required(),

  licenseNumber: Joi.string().trim().required(),

  experience: Joi.string().valid("new", "1-2", "3-5", "5+").required(),

  availability: Joi.string()
    .valid("full-time", "part-time", "weekends")
    .required(),

  emergencyContact: Joi.object({
    name: Joi.string().trim().required(),
    phone: Joi.string()
      .pattern(/^[0-9+\-\s()]+$/)
      .required(),
    relation: Joi.string().trim().required(),
  }).required(),
});
