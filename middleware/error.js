export default function (req, res, next) {
  req.status(404).json({ message: 'Страница не найдена' });
}
