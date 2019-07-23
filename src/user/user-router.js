const express = require("express");
const db = require("./user-model");
const validateMiddleware = require("./user-middleware");

const router = express.Router();

router.get("/register", validateMiddleware, (req, res) => {
  let data = req.body;

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
router.get("/api/login", validateMiddleware, (req, res) => {
  let data = req.body;

  db.authUser(data)
    .then(dbResponse  => {
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
    .then(dbResponse  => {
      return res.status(200).json({
        data: dbResponse 
      });
    })
    .catch(err => {
      res.status(500).send(err);
    });
});

module.exports = router;
