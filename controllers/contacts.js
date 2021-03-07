const Contacts = require("../model/index");
const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await Contacts.listContacts();
    return res.json({
      data: {
        contacts,
      },
    });
  } catch (e) {
    next(e);
  }
};

const getById = async (req, res, next) => {
  const id = normalizedId(req.params.contactId);
  try {
    const contact = await Contacts.getContactById(id);
    if (contact) {
      return res.json({
        data: {
          contact,
        },
      });
    } else {
      return res.status(404).json({
        message: "Not Found",
      });
    }
  } catch (e) {
    next(e);
  }
};

const create = async (req, res, next) => {
  try {
    if (req.body) {
      const contact = await Contacts.addContact(req.body);
      return res.status(201).json({
        data: {
          contact,
        },
      });
    } else {
      return res.status(400).json({
        message: "missing required name field",
      });
    }
  } catch (e) {
    next(e);
    return res.status(404).json({
      message: "Not found",
    });
  }
};

const remove = async (req, res, next) => {
  const id = normalizedId(req.params.contactId);
  try {
    const contact = await Contacts.removeContact(id);
    if (contact) {
      return res.status(200).json({
        message: "contact deleted",
        data: {
          contact,
        },
      });
    } else {
      return res.status(404).json({
        message: "Not Found",
      });
    }
  } catch (e) {
    next(e);
  }
};

const update = async (req, res, next) => {
  const id = normalizedId(req.params.contactId);
  try {
    if (req.body) {
      const contact = await Contacts.updateContact(id, req.body);
      return res.status(200).json({
        data: {
          contact,
        },
      });
    } else {
      return res.status(400).json({ message: "missing fields" });
    }
  } catch (e) {
    next(e);
    return res.status(404).json({
      message: "Not found",
    });
  }
};

module.exports = {
  getAllContacts,
  getById,
  create,
  update,
  remove,
};
