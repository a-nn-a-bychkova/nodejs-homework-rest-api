const jwt = require("jsonwebtoken");
const Users = require("../model/users");
const { HttpCode } = require("../helpers/constants");
require("dotenv").config();
const SECRET_KEY = process.env.JWT_SECRET;

const registration = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await Users.findByEmail(email);
    if (user) {
      return res.status(HttpCode.CONFLICT).json({
        message: "email is in use",
      });
    }
    const newUser = await Users.create(req.body);

    return res.status(HttpCode.CREATED).json({
      data: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
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
    if (!user || !user.validPassword(password)) {
      return res.status(HttpCode.UNAUTHORIZED).json({
        // status: "error",
        // code: HttpCode.UNAUTHORIZED,
        // data: "UNAUTHORIZED",
        message: "Ошибка от Joi или другой валидационной библиотеки",
      });
    }
    const id = user._id;
    const payload = { id };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "2h" });

    await Users.updateToken(id, token);

    return res.status(HttpCode.OK).json({
      data: {
        token,
      },
    });
  } catch (e) {
    next(e);
  }
};
const logout = async (req, res, next) => {};

module.exports = { registration, login, logout };
