import express from 'express';
import { getOrders, createOrder } from '../controllers/orders.js';

const router = express.Router();

// @route GET /api/orders
// @des Получить список заказов
router.get('/', getOrders);
// @route POST /api/orders
// @des Создать заказ
router.post('/', createOrder);

export default router;
