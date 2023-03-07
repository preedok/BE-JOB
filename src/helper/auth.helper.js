const jwt = require("jsonwebtoken");

const generate = (payload) => {
  const config = {
    expiresIn: "1h",
  };
  const token = jwt.sign(
    {
      data: payload,
    },
    process.env.SECRET_KEY_JWT,
    config
  );

  return token;
};

const reGenerate = (payload) => {
  const config = {
    expiresIn: "6h",
  };
  const refreshToken = jwt.sign(
    {
      data: payload,
    },
    process.env.SECRET_KEY_JWT,
    config
  );

  return refreshToken;
};

module.exports = {
  generate,
  reGenerate,
};
