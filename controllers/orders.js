import Order from '../models/order.js';

function mapCartItems(cart) {
  return cart.items.map((p) => ({
    product: { ...p.productId._doc },
    count: p.count,
  }));
}

/**
 * Получить список заказов пользователя
 * @param {*} req
 * @param {*} res
 */
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ 'user.userId': req.user._id });

    res.status(200).json({
      message: 'Список заказов успешно получен.',
      data: orders.map((order) => {
        return {
          ...order._doc,
          price: order.products.reduce((total, p) => {
            return (total += p.count * p.product.price);
          }, 0),
        };
      }),
    });
  } catch (error) {
    console.log('error: ', error);
    res.status(500).json({ message: 'Не удалось получить список заказов.' });
  }
};

/**
 * Создать заказ
 * @param {*} req
 * @param {*} res
 */
const createOrder = async (req, res) => {
  try {
    const user = await req.user.populate('cart.items.productId');
    const products = mapCartItems(user.cart);
    const order = await Order.create({
      user: {
        name: req.user.fullName,
        userId: req.user._id,
      },
      products,
    });

    await req.user.clearCart();

    res.status(200).json({
      message: 'Заказ успешно создан.',
      data: order,
    });
  } catch (error) {
    console.log('error: ', error);
    res.status(500).json({ message: 'Не удалось создать заказ.' });
  }
};

export { getOrders, createOrder };
