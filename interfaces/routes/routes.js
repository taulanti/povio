/**
 * Defines routes
 */
const userController = require('./user');
const middleware = require('./middleware/middleware');

exports.assignRoutes = (server, userInteractor, validator) => {
  const { createNewUser, updatePassword, getProfile, login, like, unlike, getUser, getUserList } = userController(userInteractor);
  const { verifyToken } = middleware(userInteractor);
  server.post('/signup', validator, createNewUser);
  server.post('/login', validator, login);
  server.put('/me/update-password', verifyToken, updatePassword);
  server.get('/me', verifyToken, getProfile);
  server.get('/user/:id', getUser);
  server.get('/most-liked', getUserList);
  server.get('/user/:id/like', verifyToken, like);
  server.delete('/user/:id/unlike', verifyToken, unlike);
};
