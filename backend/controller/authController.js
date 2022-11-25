const User = require("../model/userModel");
const jwt = require("jsonwebtoken");
const fetch = require("cross-fetch")

const gitAuth = async (req, res) => {
  const { access_token } = req.body;
  console.log(access_token)

  const user_res = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `token ${access_token}`,
    },
  });
  const user_dt = await user_res.json();
  const { avatar_url, login, name, url, node_id } = user_dt;
  const user = await User.findOne({
    username: name,
    login: login,
    avatarUrl: avatar_url,
    url: url,
    nodeId: node_id,
  });

  if (user) {
    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        login: user.login,
        url: user.url,
        avatarUrl: user.avatarUrl,
        nodeId: user.nodeId,
      },
      "User-Token",
      { expiresIn: "1h" }
    );
    return res.send({ message: "Login Success!", token });
  } else {
    const newUser = new User({
      username: name,
      login: login,
      url: url,
      avatarUrl: avatar_url,
      nodeId: node_id,
    });

    newUser.save((err, result) => {
      if (err) {
        res.send({ message: "Login Failed!" });
      } else {
        const token = jwt.sign(
          {
            id: result._id,
            username: result.username,
            login: result.login,
            url: result.url,
            avatarUrl: result.avatarUrl,
            nodeId: result.nodeId,
          },
          "User-Token",
          { expiresIn: "1h" }
        );

        res.send({ message: "Login Success!", token });
      }
    });
  }
};

module.exports = { gitAuth };
