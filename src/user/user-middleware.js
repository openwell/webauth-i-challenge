const md5 = require("md5");
const db = require("./user-model");

function validateUser(req, res, next) {
  const { username, password } = req.body;
  if (!req.body) {
    return res.status(400).json({
      message: "missing user data"
    });
  } else if (!username || username.trim().length < 1) {
    return res.status(400).json({
      message: "missing required username field"
    });
  } else if (!password || password.trim().length < 1) {
    return res.status(400).json({
      message: "missing required password field"
    });
  }
  next();
}
async function validateUserPassword(req, res, next) {
  const { username, password } = req.body;
  try {
    let userData = await db.getByUsername(username);
    let compareOutput = compareMyBcrypt(password, userData.password);
    if (!compareOutput) {
      return res.status(401).json({ error: "Incorrect Password" });
    }
    req.session.user = userData;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Incorrect Username" });
  }
}

function myBcrypt(
  password,
  cycle = 10,
  salt = new Date().getTime().toString()
) {
  let hashed = md5(salt + password);
  for (let i = 0; i < cycle; i++) {
    hashed = md5(hashed);
  }
  const encodedSalt = Buffer.from(salt).toString("base64");
  const encodedHash = Buffer.from(hashed).toString("base64");
  return `md5$${cycle}$${encodedSalt}$${encodedHash}`;
}

function compareMyBcrypt(rawPassword, naiveBcryptHash) {
  const [, rounds, encodedSalt] = naiveBcryptHash.split("$");
  const salt = Buffer.from(encodedSalt, "base64").toString("ascii");
  return myBcrypt(rawPassword, Number(rounds), salt) === naiveBcryptHash;
}

function restriction(req, res, next) {
  if (req.session && req.session.user) {
    console.log(req.session)
    next();
  } else {
    return res.status(400).json({ message: "No credentials provided" });
  }
}

module.exports = {
  validateUser,
  compareMyBcrypt,
  myBcrypt,
  validateUserPassword,
  restriction
};
