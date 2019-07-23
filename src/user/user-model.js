const db = require("../data/dbConfig");

module.exports = {
    getUsers, authUser
};

function getUsers() {
  return db("users");
}

function authUser(username) {
  return db("users")
  .where("username", username);
}

