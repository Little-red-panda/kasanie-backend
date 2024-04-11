export default (roles) => {
  return function (req, res, next) {
    if (!req.session.isAuthenticated) {
      return res.status(403).json({ message: 'Вы не авторизованы.' });
    }

    try {
      const userRoles = req.session.user.roles;
      let hasRole = false;
      userRoles.forEach((role) => {
        if (roles.includes(role)) {
          hasRole = true;
        }
      });
      if (!hasRole) {
        return res.status(403).json({ message: 'У вас нет доступа' });
      }
      next();
    } catch (error) {
      console.log('error: ', error);
      return res.status(403).json({ message: 'Нет доступа.' });
    }
  };
};
