const express = require("express");
const normalizedId = require("../../../helpers/helper");
const router = express.Router();
const contactsController = require("../../../controllers/contacts");
const validate = require("./validation");
// const guard = require("../../../helpers/guard");

router
  .get("/", contactsController.getAllContacts)
  .post("/", validate.addContact, contactsController.create);
router
  .get("/:contactId", contactsController.getById)
  .delete("/:contactId", contactsController.remove)
  .patch("/:contactId", validate.updateContact, contactsController.update);

module.exports = router;
