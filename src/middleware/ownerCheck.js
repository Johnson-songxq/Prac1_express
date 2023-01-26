//an example for middleware

module.exports = (req, res, next) => {
  console.log("checking owner");
  next();
};
