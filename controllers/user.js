const User = require("../models/user");

module.exports.userData = async (req, res) => {
  const users = await User.find({});
  res.json(users);
};

module.exports.newUser = (req, res, next) => {
  const { username, password } = req.body;
  User.register(new User({ username: username }), password, (err) => {
    if (err) {
      console.log("error registering user!", err);
      return next(err);
    }
    res.send(req.body.username);
  });
};

module.exports.login = (req, res) => {
  res.send(req.body.username);
};

module.exports.logout = (req, res) => {
  req.logout();
  res.send("user has been logged out.");
};
