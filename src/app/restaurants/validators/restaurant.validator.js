import Joi from "joi";

export const restaurantApplicationValidator = Joi.object({
  restaurantName: Joi.string().trim().min(2).required(),
  
  cuisineType: Joi.string().valid(
    "italian", "chinese", "indian", "mexican", "american", 
    "thai", "japanese", "mediterranean", "other"
  ).required(),
  
  description: Joi.string().max(250).min(10).required(),
  
  ownerName: Joi.string().trim().required(),
  
  email: Joi.string().email().lowercase().required(),
  
  phone: Joi.string().pattern(/^[0-9+\-\s()]+$/).required(),
  
  website: Joi.string().pattern(/^https?:\/\/.+/).optional(),
  
  address: Joi.string().required(),
  
  city: Joi.string().trim().required(),
  
  postalCode: Joi.string().trim().required(),
  
  licenseNumber: Joi.string().trim().required(),
  
  yearsInBusiness: Joi.string().valid("new", "1-2", "3-5", "6-10", "10+").required(),
  
  dailyOrders: Joi.string().valid("1-10", "11-25", "26-50", "51-100", "100+").required(),
  
  deliveryService: Joi.string().valid("own", "third-party", "both", "pickup-only").required(),
  
  notes: Joi.string().optional(),
  
});