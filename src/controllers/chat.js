const BaseController = require('./base');
const models = require('../models');
const apiConfig = require('../configs/api');
const socket = require('../socket-io');

class ChatController extends BaseController {
  /**
   * Create a chat thread.
   */
  async createChatThreadItem(req, res) {
    const errorResponseObj = { validation: {} };

    if (req.validated.body?.error) {
      errorResponseObj.validation.body = req.validated.body.error;

      return this.unprocessableEntity(res, errorResponseObj);
    }

    try {
      const otherUserObj = await models.User.findByPk(
        req.validated.body.value.participantId
      );

      if (!otherUserObj) {
        return this.unprocessableEntity(res, 'Invalid participant id');
      }

      if (otherUserObj.id === req.user.id) {
        return this.unprocessableEntity(res, 'Invalid participant id');
      }

      let chatThreadObj;

      await models.sequelize.transaction(async (t) => {
        // Followed this for this weird \
        // association https://stackoverflow.com/a/54147883/4345447

        chatThreadObj = await models.ChatThread.create(
          {
            chatUsers: [
              {
                userId: req.user.id,
                adminedAt: models.sequelize.literal('CURRENT_TIMESTAMP'),
              },
              {
                userId: otherUserObj.id,
                adminedAt: models.sequelize.literal('CURRENT_TIMESTAMP'),
              },
            ],
          },
          {
            include: [
              {
                model: models.ChatUser,
                as: 'chatUsers',
                include: [
                  {
                    model: models.User,
                    as: 'user',
                  },
                ],
              },
            ],
            transaction: t,
          }
        );
      });

      const responseObj = {
        id: chatThreadObj.id,
        participants: [],
        createdAt: chatThreadObj.createdAt,
        updatedAt: chatThreadObj.updatedAt,
      };

      // TODO: FIX! The Chat thread creation doesn't return associatied user \
      // models so another query was needed explicitly.

      // eslint-disable-next-line no-restricted-syntax
      for await (const chatUserObj of chatThreadObj.chatUsers) {
        const userObj = await chatUserObj.getUser();

        responseObj.participants.push({
          id: chatUserObj.id,
          user: {
            id: userObj.id,
            name: userObj.name,
          },
          adminedAt: chatUserObj.adminedAt,
        });
      }

      return this.created(res, responseObj);
    } catch (error) {
      return this.fail(res, error);
    }
  }

  /**
   * Retrieve a list of chat threads.
   */
  async retrieveChatThreadList(req, res) {
    const errorResponseObj = { validation: {} };

    if (req.validated.query?.error) {
      errorResponseObj.validation.query = req.validated.query.error;

      return this.unprocessableEntity(res, errorResponseObj);
    }

    const orderSqlQuery = [];

    if (typeof req.validated.query.value.orderBy !== 'undefined') {
      let queries = [];

      if (Array.isArray(req.validated.query.value.orderBy)) {
        queries = [...req.validated.query.value.orderBy];
      } else {
        queries = [req.validated.query.value.orderBy];
      }

      queries.forEach((queryVal) => {
        switch (queryVal) {
          case 'createdAt':
            orderSqlQuery.push(['createdAt', 'ASC']);
            break;
          case '-createdAt':
            orderSqlQuery.push(['createdAt', 'DESC']);
            break;
          case 'updatedAt':
            orderSqlQuery.push(['updatedAt', 'ASC']);
            break;
          case '-updatedAt':
            orderSqlQuery.push(['updatedAt', 'DESC']);
            break;
          default:
            break;
        }
      });
    } else {
      // Order by `createdAt` by default.
      orderSqlQuery.push(['createdAt', 'DESC']);
    }

    const paginationSqlQuery = {
      limit: apiConfig.defaultPaginationLimit,
      offset: 0,
    };

    if (typeof req.validated.query.value.limit !== 'undefined') {
      if (req.validated.query.value.limit <= apiConfig.maxPaginationLimit)
        paginationSqlQuery.limit = req.validated.query.value.limit;
    }

    if (typeof req.validated.query.value.offset !== 'undefined') {
      paginationSqlQuery.offset = req.validated.query.value.offset;
    }

    try {
      const chatThreadObjs = await models.ChatThread.findAndCountAll({
        order: [...orderSqlQuery],
        ...paginationSqlQuery,
        include: [
          {
            model: models.ChatUser,
            where: {
              userId: req.user.id,
            },
          },
          {
            model: models.ChatUser,
            as: 'chatUsers',
            include: [
              {
                model: models.User,
                as: 'user',
              },
            ],
          },
        ],
        distinct: true,
      });

      const responseObj = {
        count: chatThreadObjs.count,
        ...paginationSqlQuery,
        chatThreads: [],
      };

      chatThreadObjs.rows.forEach((chatThreadObj) => {
        const threadObj = {
          id: chatThreadObj.id,
          participants: [],
          createdAt: chatThreadObj.createdAt,
          updatedAt: chatThreadObj.updatedAt,
        };

        chatThreadObj.chatUsers.forEach((chatUserObj) => {
          threadObj.participants.push({
            id: chatUserObj.id,
            user: {
              id: chatUserObj.user.id,
              name: chatUserObj.user.name,
            },
            adminedAt: chatUserObj.adminedAt,
          });
        });

        responseObj.chatThreads.push(threadObj);
      });

      return this.ok(res, responseObj);
    } catch (error) {
      return this.fail(res, error);
    }
  }

  /**
   * Retrieve a chat thread \
   * with params `chatTheadId`.
   */
  async retrieveChatThreadItem(req, res) {
    const errorResponseObj = { validation: {} };

    if (req.validated.params?.error) {
      errorResponseObj.validation.params = req.validated.params.error;

      return this.unprocessableEntity(res, errorResponseObj);
    }

    try {
      const chatThreadObj = await models.ChatThread.findOne({
        where: {
          id: req.validated.params.value.chatTheadId,
        },
        include: [
          {
            model: models.ChatUser,
            where: {
              userId: req.user.id,
            },
          },
          {
            model: models.ChatUser,
            as: 'chatUsers',
            include: [
              {
                model: models.User,
                as: 'user',
              },
            ],
          },
        ],
      });

      if (chatThreadObj) {
        const responseObj = {
          id: chatThreadObj.id,
          participants: [],
          createdAt: chatThreadObj.createdAt,
          updatedAt: chatThreadObj.updatedAt,
        };

        chatThreadObj.chatUsers.forEach((chatUserObj) => {
          responseObj.participants.push({
            id: chatUserObj.id,
            user: {
              id: chatUserObj.user.id,
              name: chatUserObj.user.name,
            },
            adminedAt: chatUserObj.adminedAt,
          });
        });

        return this.ok(res, responseObj);
      }

      return this.notFound(res, null);
    } catch (error) {
      return this.fail(res, error);
    }
  }

  /**
   * Retrieve a list of chat messages \
   * with params `chatTheadId`.
   */
  async retrieveChatMessageList(req, res) {
    const errorResponseObj = { validation: {} };

    if (req.validated.params?.error) {
      errorResponseObj.validation.params = req.validated.params.error;

      return this.unprocessableEntity(res, errorResponseObj);
    }

    if (req.validated.query?.error) {
      errorResponseObj.validation.query = req.validated.query.error;

      return this.unprocessableEntity(res, errorResponseObj);
    }

    const orderSqlQuery = [];

    if (typeof req.validated.query.value.orderBy !== 'undefined') {
      let queries = [];

      if (Array.isArray(req.validated.query.value.orderBy)) {
        queries = [...req.validated.query.value.orderBy];
      } else {
        queries = [req.validated.query.value.orderBy];
      }

      queries.forEach((queryVal) => {
        switch (queryVal) {
          case 'createdAt':
            orderSqlQuery.push(['createdAt', 'ASC']);
            break;
          case '-createdAt':
            orderSqlQuery.push(['createdAt', 'DESC']);
            break;
          case 'updatedAt':
            orderSqlQuery.push(['updatedAt', 'ASC']);
            break;
          case '-updatedAt':
            orderSqlQuery.push(['updatedAt', 'DESC']);
            break;
          default:
            break;
        }
      });
    } else {
      // Order by `createdAt` by default.
      orderSqlQuery.push(['createdAt', 'DESC']);
    }

    const paginationSqlQuery = {
      limit: apiConfig.defaultPaginationLimit,
      offset: 0,
    };

    if (typeof req.validated.query.value.limit !== 'undefined') {
      if (req.validated.query.value.limit <= apiConfig.maxPaginationLimit)
        paginationSqlQuery.limit = req.validated.query.value.limit;
    }

    if (typeof req.validated.query.value.offset !== 'undefined') {
      paginationSqlQuery.offset = req.validated.query.value.offset;
    }

    try {
      const chatThreadObj = await models.ChatThread.findOne({
        where: {
          id: req.validated.params.value.chatTheadId,
        },
        include: [
          {
            model: models.ChatUser,
            as: 'chatUsers',
            where: {
              userId: req.user.id,
            },
          },
        ],
      });

      if (!chatThreadObj) {
        return this.notFound(res, null);
      }

      const chatUserObj = await models.ChatUser.findOne({
        where: {
          userId: req.user.id,
          chatThreadId: chatThreadObj.id,
        },
      });

      if (!chatUserObj) {
        return this.notFound(res, null);
      }

      const chatMessageObjs = await models.ChatMessage.findAndCountAll({
        where: {
          chatThreadId: chatThreadObj.id,
        },
        order: [...orderSqlQuery],
        ...paginationSqlQuery,
        include: [
          {
            model: models.ChatUser,
            as: 'chatUser',
            include: [
              {
                model: models.User,
                as: 'user',
              },
            ],
          },
        ],
        distinct: true,
      });

      const responseObj = {
        count: chatMessageObjs.count,
        ...paginationSqlQuery,
        chatMessages: [],
      };

      chatMessageObjs.rows.forEach((chatMessageObj) => {
        const threadObj = {
          id: chatMessageObj.id,
          content: chatMessageObj.content,
          participant: {
            id: chatMessageObj.chatUser.id,
            user: {
              id: chatMessageObj.chatUser.user.id,
              name: chatMessageObj.chatUser.user.name,
            },
          },
          createdAt: chatMessageObj.createdAt,
          updatedAt: chatMessageObj.updatedAt,
        };

        responseObj.chatMessages.push(threadObj);
      });

      return this.ok(res, responseObj);
    } catch (error) {
      return this.fail(res, error);
    }
  }

  /**
   * Create a chat message \
   * with params `chatTheadId`.
   */
  async createChatMessageItem(req, res) {
    const errorResponseObj = { validation: {} };

    if (req.validated.params?.error) {
      errorResponseObj.validation.params = req.validated.params.error;

      return this.unprocessableEntity(res, errorResponseObj);
    }

    if (req.validated.body?.error) {
      errorResponseObj.validation.body = req.validated.body.error;

      return this.unprocessableEntity(res, errorResponseObj);
    }

    try {
      const chatThreadObj = await models.ChatThread.findOne({
        where: {
          id: req.validated.params.value.chatTheadId,
        },
        include: [
          {
            model: models.ChatUser,
            as: 'chatUsers',
            where: {
              userId: req.user.id,
            },
          },
        ],
      });

      if (!chatThreadObj) {
        return this.notFound(res, null);
      }

      const chatUserObj = await models.ChatUser.findOne({
        where: {
          userId: req.user.id,
          chatThreadId: chatThreadObj.id,
        },
        include: [
          {
            model: models.User,
            as: 'user',
          },
        ],
      });

      if (!chatUserObj) {
        return this.notFound(res, null);
      }

      let chatMessageObj;

      await models.sequelize.transaction(async (t) => {
        chatMessageObj = await models.ChatMessage.create(
          {
            content: req.validated.body.value.content,
            chatThreadId: chatThreadObj.id,
            chatUserId: chatUserObj.id,
          },
          {
            include: [
              {
                model: models.ChatUser,
                as: 'chatUser',
                include: [
                  {
                    model: models.User,
                    as: 'user',
                  },
                ],
              },
            ],
            transaction: t,
          }
        );
      });

      const responseObj = {
        id: chatMessageObj.id,
        content: chatMessageObj.content,
        participant: {
          id: chatUserObj.id,
          user: {
            id: chatUserObj.user.id,
            name: chatUserObj.user.name,
          },
        },
        createdAt: chatMessageObj.createdAt,
        updatedAt: chatMessageObj.updatedAt,
      };

      // Emit a new socket event.
      const socketResponseObj = {
        id: chatMessageObj.id,
        participant: {
          id: chatUserObj.id,
          user: {
            id: chatUserObj.user.id,
            name: chatUserObj.user.name,
          },
        },
        createdAt: chatMessageObj.createdAt,
      };

      socket
        .of('/chat')
        .to(`chat-thread-${chatThreadObj.id}`)
        .emit('chat.new-message', socketResponseObj);

      return this.created(res, responseObj);
    } catch (error) {
      return this.fail(res, error);
    }
  }
}

module.exports = new ChatController();
