const authMiddleware = require('./middlewares/auth');
const models = require('../models');
const logger = require('../loaders/winston');

module.exports = (socketIo) => {
  const chatNp = socketIo.of('/chat');

  chatNp.use(authMiddleware.authRequired);

  chatNp.on('connection', (socket) => {
    /**
     * Listen to events emitted inside a chat thread \
     * (new message, message deletion etc.)
     *
     * An auhenticated user is attached to a socket room \
     * named in the following format,
     *
     * chat-thread-$UUID$
     */
    socket.on('chat.listen', async (data) => {
      try {
        const chatThreadObj = await models.ChatThread.findOne({
          where: {
            id: data.chatThreadId,
          },
          include: [
            {
              model: models.ChatUser,
              as: 'chatUsers',
              where: {
                userId: socket.user.id,
              },
            },
          ],
        });

        if (!chatThreadObj) {
          return socket.emit('chat.error', 'Chat thread not found');
        }

        return socket.join(`chat-thread-${chatThreadObj.id}`);
      } catch (error) {
        logger.error(error);

        return socket.emit('chat.error', 'Internal server error');
      }
    });
  });
};
