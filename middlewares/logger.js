module.exports = (req, res, next) => {
  console.log(`${req.method} ${req.path} unauthId ${req.session.unauthId}`);
  next();
};
