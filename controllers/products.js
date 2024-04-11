import Product from '../models/product.js';
import { validationResult } from 'express-validator';

/**
 * Получить все товары
 * @param {*} req
 * @param {*} res
 */
const getProducts = async (req, res) => {
  try {
    const products = await Product.find();

    res
      .status(200)
      .json({ message: 'Список товаров успешно получен.', data: products });
  } catch (error) {
    console.log('error: ', error);
    res.status(500).json({ message: 'Не удалось получить список товаров.' });
  }
};

/**
 * Получить товар по id
 * @param {*} req
 * @param {*} res
 */
const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);

    res
      .status(200)
      .json({ message: 'Товар успешно получен.', data: product.toClient() });
  } catch (error) {
    console.log('error: ', error);
    res.status(400).json({ message: 'Такого товара не существует.' });
  }
};

/**
 * Создать товар
 * @param {*} req
 * @param {*} res
 */
const createProduct = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(errors.array());
  }

  try {
    const { title, price, description, category } = req.body;
    const product = await Product.create({
      title,
      price,
      description,
      category,
      image,
    });

    res.status(201).json({ message: 'Товар успешно создан.', data: product });
  } catch (error) {
    console.log('error: ', error);
    res.status(500).json({ message: 'Не удалось создать товар.' });
  }
};

/**
 * Редактировать товар
 * @param {*} req
 * @param {*} res
 */
const editProduct = async (req, res) => {
  try {
    const { title, price, description, category } = req.body;
    await Product.findByIdAndUpdate(req.params.id, {
      title,
      price,
      description,
      category,
      image,
    });

    res.status(201).json({ message: 'Товар успешно отредактирован.' });
  } catch (error) {
    console.log('error: ', error);
    res.status(500).json({ message: 'Не удалось отредактировать товар.' });
  }
};

/**
 * Удалить товар
 * @param {*} req
 * @param {*} res
 */
const deleteProduct = async (req, res) => {
  try {
    await Product.deleteOne({ _id: req.params.id });

    res.status(201).json({ message: 'Товар успешно удален.' });
  } catch (error) {
    console.log('error: ', error);
    res.status(500).json({ message: 'Не удалось удалить товар.' });
  }
};

export { getProducts, getProduct, createProduct, editProduct, deleteProduct };
