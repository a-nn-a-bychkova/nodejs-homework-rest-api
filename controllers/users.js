const jwt = require("jsonwebtoken");
const Users = require("../model/users");
const { HttpCode } = require("../helpers/constants");
const fs = require("fs").promises;
const path = require("path");
const Jimp = require('jimp')
const { promisify } = require("util");
const cloudinary = require("cloudinary").v2;
const createFolderIsExist = require("../helpers/create-dir");
const { nanoid } = require('nanoid')
const EmailService = require('../services/email')
require("dotenv").config();

const SECRET_KEY = process.env.JWT_SECRET;
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});
const uploadCloud = promisify(cloudinary.uploader.upload);

const reg = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await Users.findByEmail(email);
    if (user) {
      return res.status(HttpCode.CONFLICT).json({
        message: "Email is already in use",
      });
    }
    const verificationToken = nanoid()
    const emailService = new EmailService(process.env.NODE_ENV)
    await emailService.sendEmail(verificationToken, email)
    const newUser = await Users.create({
      ...req.body,
      verify: false,
      verificationToken,
    })
    return res.status(HttpCode.CREATED).json({
      status: 'success',
      code: HttpCode.CREATED,
      data: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        avatar: newUser.avatar,
      },
    })
  } catch (e) {
    next(e);
  }
};
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await Users.findByEmail(email);
    const isValidPassword = (await user) ? user.validPassword(password) : null;
    if (!user || !isValidPassword) {
      return res.status(HttpCode.UNAUTHORIZED).json({
        message: "Email or password is wrong",
      });
    }
    const id = user._id;
    const payload = { id };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "2h" });

    await Users.updateToken(id, token);

    return res.status(HttpCode.OK).json({
      data: {
        token,
        user: {
          email: user.email,
          subscription: user.subscription,
        },
      },
    });
  } catch (e) {
    next(e);
  }
};
const logout = async (req, res, next) => {
  try {
    const id = req.user.id;

    const user = await Users.findById(id);
    if (!user) {
      return res.status(HttpCode.UNAUTHORIZED).json({
        message: "Not authorized",
      });
    }
    await Users.updateToken(id, null);
    return res.status(HttpCode.NO_CONTENT).json({});
  } catch (err) {
    next(err);
  }
};
const current = async (req, res, next) => {
  try {
    const id = req.user.id;
    const user = await Users.findById(id);
    if (!user) {
      return res.status(HttpCode.UNAUTHORIZED).json({
        message: "Not authorized",
      });
    }
    return res.status(HttpCode.OK).json({
      data: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const id = req.user.id;
    const subscription = req.body.subscription;
    const user = await Users.updateUserSubscription(id, subscription);
    if (!user) {
      return res.status(HttpCode.UNAUTHORIZED).json({
        message: "Not authorized",
      });
    }
    return res.status(HttpCode.OK).json({
      data: {
        subscription,
      },
      message: `The subscription was successfully changed to ${subscription}`,
    });
    // const { id, subscription } = req.body;
    // const user = await Users.updateUserSubscription(id, subscription);
    // return res.status(HttpCode.OK).json({
    //   message: `The subscription was successfully changed to ${subscription}`,
    // });
  } catch (e) {
    next(e);
  }
};

const avatars = async (req, res, next) => {
  try {
    const id = req.user.id;
    // const avatarUrl = await saveAvatarToStatic(req)
    const {
      public_id: imgIdCloud,
      secure_url: avatarUrl,
    } = await saveAvatarToCloud(req);
    // await Users.updateAvatar(id, avatarUrl)
    await Users.updateAvatar(id, avatarUrl, imgIdCloud);
    return res.json({
      status: "success",
      code: HttpCode.OK,
      data: {
        avatarUrl,
      },
    });
  } catch (e) {
    next(e);
  }
};

// const saveAvatarToStatic = async (req) => {
//   const id = req.user.id;
//   const AVATARS_OF_USERS = process.env.AVATARS_OF_USERS;
//   const pathFile = req.file.path;
//   const newNameAvatar = `${Date.now()}-${req.file.originalname}`;
//   const img = await Jimp.read(pathFile);
//   await img
//     .autocrop()
//     .cover(250, 250, Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE)
//     .writeAsync(pathFile);
//   await createFolderIsExist(path.join(AVATARS_OF_USERS, id));
//   await fs.rename(pathFile, path.join(AVATARS_OF_USERS, id, newNameAvatar));
//   const avatarUrl = path.normalize(path.join(id, newNameAvatar));
//   try {
//     await fs.unlink(
//       path.join(process.cwd(), AVATARS_OF_USERS, req.user.avatar)
//     );
//   } catch (e) {
//     console.log(e.message);
//   }
//   return avatarUrl;
// };

const saveAvatarToCloud = async (req) => {
  const pathFile = req.file.path;
  const result = await uploadCloud(pathFile, {
    folder: "Photo",
    transformation: { width: 250, height: 250, crop: "fill" },
  });
  cloudinary.uploader.destroy(req.user.imgIdCloud, (err, result) => {
    console.log("ERROR&RESULT", err, result);
  });
  try {
    await fs.unlink(pathFile);
  } catch (e) {
    console.log(e.message);
  }
  return result;
};

const verify = async (req, res, next) => {
  try {
    const user = await Users.findByVerificationToken(req.params.token)
    if (user) {
      await Users.updateVerificationToken(user.id, true, null)
      return res.json({
        status: 'success',
        code: HttpCode.OK,
        message: 'Verification successful!',
      })
    }
    return res.status(HttpCode.BAD_REQUEST).json({
      status: 'error',
      code: HttpCode.BAD_REQUEST,
      data: 'Bad request',
      message: 'Link is not valid',
    })
  } catch (e) {
    next(e)
  }
}

module.exports = { reg, login, logout, current, update, avatars, verify };
// module.exports = { reg, login, logout, current, update, avatars};
