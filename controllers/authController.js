const User = require("../model/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");

exports.register = async (req, res, next) => {
  try {
    const { userName, email, mobileNo, images } = req.body;

    const harshPW = await bcrypt.hash(req.body.password, 12);

    let imageNames = [];

    if (Array.isArray(images)) {
      images.forEach((image) => {
        if (!image.startsWith("data:"))
          return res.status().json({
            success: false,
            alert: "Image is not in base64 format",
          });
      });

      try {
        await Promise.all(
          images.map(async (image) => {
            const newImage = await uploadFile(image);

            const finalImageName = `/uploads/${newImage}`;

            imageNames.push(finalImageName);
          })
        );
      } catch (error) {
        const err = new Error("Error in image Upload");
        err.StatusCode = 500;
        throw err;
      }
    }

    const finalImage = imageNames.join();

    const user = {
      userName,
      email,
      mobileNo,
      images: finalImage ? finalImage : null,
      password: harshPW,
    };

    const createUser = await User.create(user);

    res.status(200).json({
      success: true,
      data: createUser,
      message: "user resgister successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      const error = new Error("user not found..!");
      error.statusCode = 404;
      throw error;
    }

    const passwordVF = await bcrypt.compare(password, user.password);

    if (!passwordVF) {
      const error = new Error("user not found..!");
      error.statusCode = 404;
      throw error;
    }

    const payload = {
      id: user.id,
      email: user.email,
    };

    const token = await jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: "24h",
    });

    res.status(200).json({
      success: true,
      data: token,
      message: "Token created successfully",
    });
  } catch (error) {
    const status = error.statusCode || 500;
    return res.status(status).json({
      success: false,
      message: error.message,
    });
  }
};

const uploadFile = async (base64Data) => {
  //Find extension of file
  const ext = base64Data.substring(
    base64Data.indexOf("/") + 1,
    base64Data.indexOf(";base64")
  );
  const fileType = base64Data.substring(
    "data:".length,
    base64Data.indexOf("/")
  );
  //Forming regex to extract base64 data of file.
  const regex = new RegExp(`^data:${fileType}\/${ext};base64,`, "gi");
  //Extract base64 data.
  const base64 = base64Data.replace(regex, "");
  const filename = `${new Date().valueOf()}.${ext}`;

  const uploadPath = uploadFilePath(filename);

  await writeFile(uploadPath, base64, "base64");

  return filename;
};

const uploadFilePath = (filename) => {
  const dirPath = path.join(__dirname, `../public/uploads`);

  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath);
  }

  return path.join(dirPath, filename);
};

const writeFile = (path, data, type) => {
  return new Promise((resolve, rejects) => {
    fs.writeFile(path, data, type, (err) => {
      if (err) rejects(err);
      resolve(true);
    });
  });
};
