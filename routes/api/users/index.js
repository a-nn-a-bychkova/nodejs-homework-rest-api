const express = require("express");
const router = express.Router();
const userController = require("../../../controllers/users");
const validate = require("./validation");
const guard = require("../../../helpers/guard");
const { createAccountLimiter } = require("../../../helpers/rate-limit-reg");

router.post(
  "/auth/register",
  validate.registerUser,
  createAccountLimiter,
  userController.reg
);
router.post("/auth/login", validate.loginUser, userController.login);
router.post("/auth/logout", guard, userController.logout);
router.get("/current", guard, userController.current);
module.exports = router;
