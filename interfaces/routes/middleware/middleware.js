/**
 * middleware to verify the token
 */
function MiddlewareController(userInteractor) {
  function verifyToken(req, res, next) {
    let token = req.headers.authorization;
    if (!token) res.status(401).json({ message: 'There is no authorization token attached in header' });
    else {
      token = req.headers.authorization.split(' ')[1];
      const { verify } = userInteractor.authenticationInterface.webTokenAdapter;
      const result = verify({ token, secretKey: userInteractor.configurationData.SecretKey });
      if (result instanceof Error) {
        res.status(401).json({ message: `Verification failed.${result}` });
      } else {
        req.token = result;
        next();
      }
    }
  }

  return {
    verifyToken,
  };
}
module.exports = MiddlewareController;
