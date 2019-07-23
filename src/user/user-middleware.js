const md5 = require("md5");
const db = require("./user-model");

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
async function validateUserPassword (req, res, next) {
  const { username, password } = req.body;
  let userData = await db.getByUsername(username);
  let compareOutput = compareMyBcrypt(password, userData.password)
  if(!compareOutput){
   return res.status(401).json({error: 'Incorrect Password'})
  }
  next();
}

function myBcrypt(
  password,
  cycle = 10,
  salt = new Date().getTime().toString()
) {
  let hashed = md5(`${password}${salt}+${randomSalt}`);
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
  return this.hash(rawPassword, Number(rounds), salt) === naiveBcryptHash;
}

module.exports = { validateUser, compareMyBcrypt, myBcrypt, validateUserPassword };
