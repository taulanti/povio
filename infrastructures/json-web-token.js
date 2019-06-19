/**
 * JSON Web Token class is responsible for creating the JSON Web Token
 * More info: https://tools.ietf.org/html/rfc7519
 */
const jwt = require('jsonwebtoken');

class JsonWebToken {

  // generate() creates new token
  // options parameter contains the following
  //    tokenPayload
  //    secret
  //    expiration
  static generate(options) {
    const tokenOptionalInfo = {
      issuer: options.issuer,
      subject: options.username,
      audience: options.audience,
      algorithm: 'HS256',
      expiresIn: options.expiration,
    };

    return jwt.sign(
      options.tokenPayload,
      options.secret,
      tokenOptionalInfo,
    );
  }

  static verify(options) {
    const { token, secretKey } = options;
    try {
      const decoded = jwt.verify(token, secretKey);
      return decoded;
    } catch (error) {
      return new Error(`Error while veryfing the token. Reason: ${error}`);
    }
  }
}

module.exports = JsonWebToken;
