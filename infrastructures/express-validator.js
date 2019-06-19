/**
 * Validating input using express validator
 */
const { check, body, query, oneOf, validationResult } = require('express-validator/check');

exports.userValidator = [
  body('username')
    .exists()
    .isAlphanumeric().withMessage('firstName should be alpanumeric')
    .isLength({ min: 1, max: 99 })
    .withMessage('firstName should not be empty, should be more than one and less than 100 character')
    .trim(),
  (req, res, next) => {
    const errorValidation = validationResult(req);
    if (!errorValidation.isEmpty()) {
      return res.status(400).json({
        title: 'an error occured',
        error: errorValidation.array(),
      });
    }
    next();
  },
  body('password')
    .exists()
    .isAlphanumeric().withMessage('password should be alpanumeric')
    .isLength({ min: 1, max: 50 })
    .withMessage('lastName should not be empty, should be more than one and less than 50 character')
    .trim(),
  (req, res, next) => {

    const errorValidation = validationResult(req);
    if (!errorValidation.isEmpty()) {
      return res.status(400).json({
        title: 'an error occured',
        error: errorValidation.array(),
      });
    }
    next();
  },
];
