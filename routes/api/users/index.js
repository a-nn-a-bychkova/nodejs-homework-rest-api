const express = require("express");
const router = express.Router();
const userController = require("../../../controllers/users");
const validate = require("./validation");
const guard = require("../../../helpers/guard");
const upload = require("../../../helpers/upload");
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
router.patch("/", guard, validate.updateSubscription, userController.update);
router.patch(
  "/avatars",
  [guard, upload.single("avatar"), validate.uploadAvatar],
  userController.avatars
);
router.get('/verify/:token',userController.verify)
module.exports = router;
