const express = require("express");
const normalizedId = require("../../../helpers/helper");
const router = express.Router();
const userController = require("../../../controllers/users");
const validate = require("./validation");

router.post("/auth/register", userController.registration);
router.post("/auth/login", userController.login);
router.post("/auth//logout", userController.logout);
module.exports = router;
