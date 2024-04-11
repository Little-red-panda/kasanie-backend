import express from 'express';
import { addToCart, getCart, removeFromCart } from '../controllers/cart.js';

const router = express.Router();

// @route POST /api/cart/add
// @des Добавить товар в корзину
router.post('/add', addToCart);
// @route GET /api/cart
// @des Получить содержимое корзины
router.get('/', getCart);
// @route DELETE /api/cart/remove/:id
// @des Удалить товар из корзины
router.delete('/remove/:id', removeFromCart);

export default router;
