import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import sendgrid from 'nodemailer-sendgrid-transport';
import crypto from 'crypto';
import 'dotenv/config';
import User from '../models/user.js';
import Role from '../models/role.js';
import { validationResult } from 'express-validator';
import regMail from '../emails/registration.js';
import resetEmail from '../emails/reset.js';

const SENDGRID_KEY = process.env.SENDGRID_KEY;
const transporter = nodemailer.createTransport(
  sendgrid({
    auth: { api_key: SENDGRID_KEY },
  })
);

/**
 * Создать пользователя
 * @param {*} req
 * @param {*} res
 */
const registerUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json(errors.array());
    }

    const { fullName, email, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const userRole = await Role.findOne({ value: 'USER' });
    const user = await User.create({
      fullName,
      email,
      passwordHash: hash,
      cart: { items: [] },
      roles: [userRole.value],
    });

    const { passwordHash, ...userData } = user._doc;
    // await transporter.sendMail(regMail(email))

    res.status(201).json({
      message: 'Пользователь успешно зарегистрирован.',
      data: { ...userData },
    });
  } catch (error) {
    console.log('error: ', error);
    res
      .status(500)
      .json({ message: 'Не удалось зарегистрировать пользователя.' });
  }
};

/**
 * Залогиниться
 * @param {*} req
 * @param {*} res
 */
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const candidate = await User.findOne({ email });

    if (candidate) {
      const match = await bcrypt.compare(password, candidate.passwordHash);

      if (match) {
        req.session.user = candidate;
        req.session.isAuthenticated = true;
        req.session.save((err) => {
          if (err) {
            throw err;
          }
          res.status(201).json({
            message: 'Авторизация прошла успешно.',
          });
        });
      } else {
        res.status(201).json({
          message: 'Неверный логин или пароль.',
        });
      }
    } else {
      res.status(201).json({
        message: 'Неверный логин или пароль.',
      });
    }
  } catch (error) {
    console.log('error: ', error);
    res.status(500).json({ message: 'Не удалось авторизоваться.' });
  }
};

/**
 * Разлогиниться
 * @param {*} req
 * @param {*} res
 */
const logoutUser = async (req, res) => {
  try {
    req.session.destroy(() => {
      res.status(201).json({
        message: 'Выход из системы прошел успешно',
      });
    });
  } catch (error) {
    console.log('error: ', error);
    res.status(500).json({ message: 'Не удалось выйти из системы.' });
  }
};

/**
 * Восстановить пароль
 * @param {*} req
 * @param {*} res
 */
const resetPassword = async (req, res) => {
  try {
    crypto.randomBytes(32, async (error, buffer) => {
      if (error) {
        return res
          .status(500)
          .json({ message: 'Не удалось отправить запрос.' });
      }
      const token = buffer.toString('hex');
      const candidate = User.findOne({ email: req.body.email });

      if (candidate) {
        candidate.resetToken = token;
        candidate.resetTokenExp = new Date.now() + 60 * 60 * 1000;
        await candidate.save();
        await transporter.sendMail(resetEmail(candidate.email, token));
        res.status(200).json({
          message: 'Запрос на восстановление пароля успешно создан.',
        });
      } else {
        return res
          .status(500)
          .json({ message: 'Такой Email не зарегистрирован.' });
      }
    });
  } catch (error) {
    console.log('error: ', error);
    res.status(500).json({ message: 'Не удалось отправить запрос.' });
  }
};

/**
 * Получить данные пользователя по токену
 * @param {*} req
 * @param {*} res
 */
const getPasswordToken = async (req, res) => {
  if (!req.params.token) {
    return res.status(500).json({ message: 'Отсутствует токен' });
  }

  try {
    const user = await User.findOne({
      resetToken: req.params.token,
      resetTokenExp: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(500).json({ message: 'Токен не действителен' });
    } else {
      res.status(200).json({
        message: 'Токен действителен',
        data: {
          userId: user._id.toString(),
          token: req.params.token,
        },
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Не удалось обработать токен.' });
  }
};

/**
 * Установить новый пароль
 * @param {*} req
 * @param {*} res
 */
const setPassword = async (req, res) => {
  try {
    const user = await User.findOne({
      _id: req.body.userId,
      resetToken: req.body.token,
      resetTokenExp: { $gt: Date.now() },
    });

    if (user) {
      user.password = await bcrypt.hash(req.body.password, 10);
      user.resetToken = undefined;
      user.resetTokenExp = undefined;
      await user.save();
      res.status(200).json({ message: 'Установлен новый пароль.' });
    } else {
      res.status(500).json({ message: 'Время жизни токена истекло.' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Не удалось установить новый пароль.' });
  }
};

/**
 * Юзеры
 * @param {*} req
 * @param {*} res
 */
const getUsers = async (req, res) => {
  try {
    res.json('OK');
  } catch (error) {
    console.log('error: ', error);
    res.status(500).json({ message: 'Не удалось выйти из системы.' });
  }
};

export {
  registerUser,
  loginUser,
  logoutUser,
  resetPassword,
  getPasswordToken,
  setPassword,
  getUsers,
};
