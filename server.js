import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';
import 'dotenv/config';
import session from 'express-session';
import MongoDBSession from 'connect-mongodb-session';
import productsRoutes from './routes/products.js';
import usersRoutes from './routes/auth.js';
import cartRoutes from './routes/cart.js';
import ordersRoutes from './routes/orders.js';
import authMiddleware from './middleware/variables.js';
import userMiddleware from './middleware/user.js';
import errorHandler from './middleware/error.js';

const MONGODB_URI = process.env.DATABASE_URI;
const port = process.env.PORT || 5000;
const SESSION_SECRET = process.env.SESSION_SECRET;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const corsOptions = {
  origin: 'http://localhost:5173',
};

const app = express();
app.use(cors(corsOptions));
const MongoDBStore = MongoDBSession(session);
const store = new MongoDBStore({
  collection: 'sessions',
  uri: MONGODB_URI,
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/static', express.static(path.join(__dirname, 'public')));
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store,
  })
);
app.use(authMiddleware);
app.use(userMiddleware);

app.use('/api/products', productsRoutes);
app.use('/api/auth', usersRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', ordersRoutes);

app.use(errorHandler);

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    app.listen(port, (error) => {
      error ? console.log(error) : console.log(`Север запущен. Порт: ${port}`);
    });
  })
  .catch((err) => console.log(err));
