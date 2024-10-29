// backend/src/validators/service.validator.js
const Joi = require('joi');

const serviceSchema = Joi.object({
    title: Joi.string().required().min(5).max(100),
    description: Joi.string().required().min(20).max(1000),
    category: Joi.string().required(),
    price: Joi.number().required().min(0),
    priceType: Joi.string().valid('fixed', 'hourly', 'negotiable'),
    location: Joi.string().required(),
    serviceArea: Joi.number().required().min(1).max(100),
    availableDays: Joi.array().items(Joi.string()),
    workingHours: Joi.object({
        start: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
        end: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    })
});

exports.validateService = (data) => {
    return serviceSchema.validate(data);
};