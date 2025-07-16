import Joi from 'joi';

export const userSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    username: Joi.string().required(),
    role_id: Joi.number().integer().min(1)
});