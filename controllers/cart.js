import Product from '../models/product.js';

/**
 * Добавить товар в корзину
 * @param {*} req
 * @param {*} res
 */
const addToCart = async (req, res) => {
  try {
    const product = await Product.findById(req.body.productId);
    await req.user.addToCart(product);

    res
      .status(200)
      .json({ message: 'Товар добавлен в корзину.', data: req.user.cart });
  } catch (error) {
    console.log('error: ', error);
    res.status(500).json({ message: 'Не удалось добавить товар в корзину.' });
  }
};

function mapCartItems(cart) {
  return cart.items.map((p) => ({
    ...p.productId._doc,
    id: p.productId.id,
    count: p.count,
  }));
}

function computePrice(products) {
  return products.reduce((total, product) => {
    return (total += product.price * product.count);
  }, 0);
}

/**
 * Получить содержимое корзины
 * @param {*} req
 * @param {*} res
 */
const getCart = async (req, res) => {
  try {
    const user = await req.user.populate('cart.items.productId');
    const products = mapCartItems(user.cart);

    res.status(200).json({
      message: 'Получено содержимое корзины.',
      data: { products, price: computePrice(products) },
    });
  } catch (error) {
    console.log('error: ', error);
    res
      .status(500)
      .json({ message: 'Не удалось получить содержимое корзины.' });
  }
};

/**
 * Удалить товар из корзины
 * @param {*} req
 * @param {*} res
 */
const removeFromCart = async (req, res) => {
  try {
    await req.user.removeFromCart(req.params.id);
    const user = await req.user.populate('cart.items.productId');
    const products = mapCartItems(user.cart);

    res.status(200).json({
      message: 'Товар удален из корзины.',
      data: { products, price: computePrice(products) },
    });
  } catch (error) {
    console.log('error: ', error);
    res.status(500).json({ message: 'Не удалось удалить товар из корзины.' });
  }
};

export { addToCart, getCart, removeFromCart };
