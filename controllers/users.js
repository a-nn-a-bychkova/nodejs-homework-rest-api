const jwt = require("jsonwebtoken");
const Users = require("../model/users");
const { HttpCode } = require("../helpers/constants");
require("dotenv").config();
const SECRET_KEY = process.env.JWT_SECRET;

const reg = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await Users.findByEmail(email);
    if (user) {
      return res.status(HttpCode.CONFLICT).json({
        message: "Email is already in use",
      });
    }
    const newUser = await Users.create(req.body);

    return res.status(HttpCode.CREATED).json({
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
      },
    });
  } catch (e) {
    next(e);
  }
};
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await Users.findByEmail(email);
    const isValidPassword = await user.validPassword(password);
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

module.exports = { reg, login, logout, current, update };
