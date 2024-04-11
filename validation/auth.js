import { body } from 'express-validator';
import User from '../models/user.js';

export const registerValidation = [
  body('email')
    .isEmail()
    .withMessage('Неверный формат')
    .custom(async (value) => {
      try {
        const user = await User.findOne({ email: value });
        if (user) Promise.reject('Пользователь с таким Email уже существует');
      } catch (error) {
        console.log('error: ', error);
      }
    })
    .normalizeEmail(),
  body('password')
    .isLength({ min: 5, max: 56 })
    .isAlphanumeric()
    .withMessage('Пароль должен состоять минимум из 5 символов'),
  body('confirm').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Пароли должны совпадать');
    }
    return true;
  }),
  body('fullName').isLength({ min: 2 }).withMessage('Укажите имя'),
];
