const { body } = require('express-validator');


const nameRule = body('name')
  .isLength({ min: 3, max: 60 })
  .withMessage('Name must be 3-60 chars');



const addressRule = body('address')
.isString()
.isLength({ max: 400 })
.withMessage('Address max 400 chars');


const emailRule = body('email').isEmail().withMessage('Invalid email');


const passwordRule = body('password')
.isLength({ min: 8, max: 16 })
.matches(/[A-Z]/)
.withMessage('Must include uppercase')
.matches(/[!@#$%^&*()_+=\-{}[\]\\|:;"'<>,.?/]/)
.withMessage('Must include special char');


const scoreRule = body('score').isInt({ min: 1, max: 5 });


module.exports = { nameRule, addressRule, emailRule, passwordRule, scoreRule };