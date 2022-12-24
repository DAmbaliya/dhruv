const User = require("../model/userModel");
const bcrypt = require("bcryptjs");

exports.getAllStudent = async (req, res, next) => {
 
    const user = await User.find();

    res.status(200).json({
      success: true,
      data: user,
      message: "user get successfully",
    });
 
};

exports.getStudentByID = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      const error = new Error("user not found..!");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      success: true,
      data: user,
      message: "user get successfully",
    });
  } catch (error) {
    const status = error.statusCode || 500;
    return res.status(status).json({
      success: false,
      message: error.message,
    });
  }
};



exports.updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      const error = new Error("user not found..!");
      error.statusCode = 404;
      throw error;
    }

    user.userName = req.body.userName;
    user.email = req.body.email;
    user.mobileNo = req.body.mobileNo;
    user.password = req.body.password;

    const updateUser = await user.save();

    res.status(200).json({
      success: true,
      data: updateUser,
      message: "user updated successfully",
    });
  } catch (error) {
    const status = error.statusCode || 500;
    return res.status(status).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      const error = new Error("user not found..!");
      error.statusCode = 404;
      throw error;
    }

    const deleteUser = await user.remove();

    res.status(200).json({
      success: true,
      data: deleteUser,
      message: "user deleted successfully",
    });
  } catch (error) {
    const status = error.statusCode || 500;
    return res.status(status).json({
      success: false,
      message: error.message,
    });
  }
};
