function validateUser(req, res, next) {
  const { username, password } = req.body;
  if (!req.body) {
    return res.status(400).json({
      message: "missing user data"
    });
  } else if (!username || username.trim().length > 1) {
    return res.status(400).json({
      message: "missing required username field"
    });
  } else if (!password || password.trim().length > 1) {
    return res.status(400).json({
      message: "missing required password field"
    });
  }
  next();
}


module.exports = validateUser;
