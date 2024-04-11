import express from 'express';
import {
  loginUser,
  registerUser,
  logoutUser,
  resetPassword,
  getPasswordToken,
  setPassword,
  getUsers,
} from '../controllers/auth.js';
import { registerValidation } from '../validation/auth.js';
import roleMiddleware from '../middleware/role.js';

const router = express.Router();

// @route POST /api/auth/register
// @des Добавить пользователя
router.post('/register', registerValidation, registerUser);
// @route POST /api/auth/login
// @des Залогиниться на сайте
router.post('/login', registerValidation, loginUser);
// @route POST /api/auth/logout
// @des Разлогиниться на сайте
router.post('/logout', registerValidation, logoutUser);
// @route POST /api/auth/reset
// @des Восстановить пароль
router.post('/reset', registerValidation, resetPassword);
// @route POST /api/auth/reset
// @des Восстановить пароль
router.get('/password/:token', registerValidation, getPasswordToken);
// @route POST /api/auth/reset
// @des Восстановить пароль
router.post('/password', registerValidation, setPassword);
// router.get('/users', roleMiddleware(['ADMIN']), getUsers);

export default router;
