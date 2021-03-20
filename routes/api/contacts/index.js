const express = require("express");

const router = express.Router();
const contactsController = require("../../../controllers/contacts");
const validate = require("./validation");
const guard = require("../../../helpers/guard");

router
  .get("/", guard, contactsController.getAllContacts)
  .post("/", guard, validate.addContact, contactsController.create);
router
  .get("/:contactId", guard, contactsController.getById)
  .delete("/:contactId", guard, contactsController.remove)
  .patch(
    "/:contactId",
    guard,
    validate.updateContact,
    contactsController.update
  );

module.exports = router;
