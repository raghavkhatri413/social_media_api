import Joi from 'joi';

export const userSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    username: Joi.string().required(),
    role: Joi.string().valid('admin', 'moderator', 'user').optional()
});