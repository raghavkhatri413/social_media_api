import Joi from 'joi';

export const commentSchema = Joi.object({
    comment_text: Joi.string().max(255).required(),
});