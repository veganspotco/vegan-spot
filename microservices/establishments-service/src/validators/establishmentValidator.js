import Joi from 'joi';

const openingHoursSchema = Joi.object({
  monday: Joi.object({
    open: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    close: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
  }),
  tuesday: Joi.object({
    open: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    close: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
  }),
  wednesday: Joi.object({
    open: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    close: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
  }),
  thursday: Joi.object({
    open: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    close: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
  }),
  friday: Joi.object({
    open: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    close: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
  }),
  saturday: Joi.object({
    open: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    close: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
  }),
  sunday: Joi.object({
    open: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    close: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
  })
}).min(1);

export const createEstablishmentSchema = Joi.object({
  name: Joi.string().min(2).max(255).required().messages({
    'string.empty': 'El nombre es requerido',
    'string.min': 'El nombre debe tener al menos 2 caracteres'
  }),
  description: Joi.string().max(1000).optional(),
  address: Joi.string().min(5).max(500).required(),
  latitude: Joi.number().min(-90).max(90).optional(),
  longitude: Joi.number().min(-180).max(180).optional(),
  phone: Joi.string().pattern(/^\+?[\d\s\-\(\)]+$/).optional(),
  email: Joi.string().email().optional(),
  website: Joi.string().uri().optional(),
  type: Joi.string().valid('vegetarian', 'vegan', 'vegetarian_friendly').required(),
  price_range: Joi.string().valid('low', 'medium', 'high', 'luxury').optional(),
  opening_hours: openingHoursSchema.optional(),
  created_by: Joi.string().uuid().required()
});

export const updateEstablishmentSchema = Joi.object({
  name: Joi.string().min(2).max(255).optional(),
  description: Joi.string().max(1000).optional(),
  address: Joi.string().min(5).max(500).optional(),
  latitude: Joi.number().min(-90).max(90).optional(),
  longitude: Joi.number().min(-180).max(180).optional(),
  phone: Joi.string().pattern(/^\+?[\d\s\-\(\)]+$/).optional(),
  email: Joi.string().email().optional(),
  website: Joi.string().uri().optional(),
  type: Joi.string().valid('vegetarian', 'vegan', 'vegetarian_friendly').optional(),
  price_range: Joi.string().valid('low', 'medium', 'high', 'luxury').optional(),
  opening_hours: openingHoursSchema.optional(),
  is_active: Joi.boolean().optional()
}).min(1);