import jwt from 'jsonwebtoken';
import 'dotenv/config';

const TOKEN_SECRET = process.env.TOKEN_SECRET;

export default (req, res, next) => {
  if (!req.session.isAuthenticated) {
    return res.status(403).json({ message: 'Вы не авторизованы.' });
  }

  const token = req.session.token;
  if (token) {
    try {
      const decoded = jwt.verify(token, TOKEN_SECRET);
      req.userId = decoded.id;
      next();
    } catch (error) {
      console.log('error: ', error);
      return res.status(403).json({ message: 'Нет доступа.' });
    }
  } else {
    return res.status(403).json({ message: 'Нет доступа.' });
  }
};

//! Пока не используется
