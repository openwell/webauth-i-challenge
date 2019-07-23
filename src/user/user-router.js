const express = require("express");
const db = require("./user-model");
const auth = require("./user-middleware");

const router = express.Router();

router.post("/register", auth.validateUser, (req, res) => {
  const { username, password } = req.body;

  const data = {
    username: username,
    password: auth.myBcrypt(password, 10)
  };
  db.createUser(data)
    .then(dbResponse => {
      return res.status(200).json({
        data: dbResponse
      });
    })
    .catch(err => {
      res.status(500).send(err);
    });
});

router.get("/users", (req, res) => {
    db.getUsers()
      .then(dbResponse => {
        return res.status(200).json({
          data: dbResponse
        });
      })
      .catch(err => {
        res.status(500).send(err);
      });
  });
router.post("/login", auth.validateUser, auth.validateUserPassword, (req, res) => {
 
  db.getByUsername(req.body.username)
    .then(dbResponse => {
      return res.status(200).json({
        data: dbResponse
      });
    })
    .catch(err => {
      res.status(500).send(err);
    });
});


module.exports = router;
