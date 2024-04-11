import { body } from 'express-validator';

export const productValidation = [
  body('title', 'Не задано название товара').not().isEmpty(),
  body('price', 'Не задана цена').not().isEmpty(),
  body('price', 'Цена должна быть числом').isNumeric(),
  body('description', 'Не задано описание').not().isEmpty(),
  body('category', 'Не задана категория').not().isEmpty(),
  body('image', 'Введите корректный Url картинки').isURL(),
];
