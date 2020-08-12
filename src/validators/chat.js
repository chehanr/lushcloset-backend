const Joi = require('joi');

module.exports = {
  createChatThreadItemSchema: {
    BODY: Joi.object({
      // participantId: Joi.alternatives().try(
      //   Joi.array().items(Joi.string().uuid().required()),
      //   Joi.string().uuid().required()
      // ),
      participantId: Joi.string().uuid().required(),
    }),
  },

  retrieveChatThreadListSchema: {
    QUERY: Joi.object({
      orderBy: Joi.alternatives().try(
        Joi.array().items(
          Joi.valid('createdAt', '-createdAt', 'updatedAt', '-updatedAt')
        ),
        Joi.valid('createdAt', '-createdAt', 'updatedAt', '-updatedAt')
      ),
      limit: Joi.number().positive().allow(0),
      offset: Joi.number().positive().allow(0),
    }),
  },

  retrieveChatThreadItemSchema: {
    PARAMS: Joi.object({
      chatTheadId: Joi.string().uuid().required(),
    }),
  },

  retrieveChatMessageListSchema: {
    PARAMS: Joi.object({
      chatTheadId: Joi.string().uuid().required(),
    }),

    QUERY: Joi.object({
      orderBy: Joi.alternatives().try(
        Joi.array().items(
          Joi.valid('createdAt', '-createdAt', 'updatedAt', '-updatedAt')
        ),
        Joi.valid('createdAt', '-createdAt', 'updatedAt', '-updatedAt')
      ),
      limit: Joi.number().positive().allow(0),
      offset: Joi.number().positive().allow(0),
    }),
  },

  createChatMessageItemSchema: {
    PARAMS: Joi.object({
      chatTheadId: Joi.string().uuid().required(),
    }),

    BODY: Joi.object({
      content: Joi.string().required(),
    }),
  },

  retrieveChatMessageItemSchema: {
    PARAMS: Joi.object({
      chatTheadId: Joi.string().uuid().required(),
      chatMessageId: Joi.string().uuid().required(),
    }),
  },
};
