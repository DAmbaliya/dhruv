const jwt = require("jsonwebtoken");
const User = require("../model/userModel");

exports.autorize = async (req, res, next) => {
  try {
    const authorization = req.headers["authorization"];

    if (!authorization) {
      const error = new Error("authorization not found");
      error.statusCode = 422;
      throw error;
    }

    const splitAuthorization = await authorization.split(" ");

    const token = splitAuthorization[1];

    if (!token) {
      const error = new Error("authorization not found");
      error.statusCode = 422;
      throw error;
    }

    let Decode;
    try {
      Decode = await jwt.verify(token, process.env.SECRET_KEY);
    } catch (erro) {
      const error = new Error("authorization not found");
      error.statusCode = 422;
      throw erro;
    }

    const { id } = Decode;

    const user = await User.findById(id).lean();

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 422;
      throw error;
    }

    req.user = user;

    next();
  } catch (error) {
    const status = error.statusCode || 500;
    return res.status(status).json({
      success: false,
      message: error.message,
    });
  }
};
