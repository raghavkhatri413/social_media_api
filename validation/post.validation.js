import Joi from 'joi';

export const postSchema=Joi.object({
    post: Joi.string().required(),
    caption: Joi.string().max(255).allow('', null)
});