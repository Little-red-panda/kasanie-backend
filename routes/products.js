import express from 'express';
import path from 'path';
import multer from 'multer';
import {
  getProducts,
  createProduct,
  getProduct,
  editProduct,
  deleteProduct,
} from '../controllers/products.js';

import { productValidation } from '../validation/products.js';

const router = express.Router();

// @route GET /api/products
// @des Получить все продукты
router.get('/', getProducts);
// @route GET /api/products/:id
// @des Получить продукт по id
router.get('/:productId', getProduct);
// @route POST /api/products
// @des Создать продукт
router.post('/', productValidation, createProduct);
// @route POST /api/products/:id/edit
// @des Редактировать продукт
router.post('/edit/:id', editProduct);
// @route POST /api/products/:id/remove
// @des Удалить продукт
router.post('/remove/:id', deleteProduct);

export default router;
