const db = require("./db");
const { v4: uuid } = require("uuid");

const listContacts = async () => {
  return db.get("contacts").value();
};

const getContactById = async (id) => {
  db.get("contacts").find({ id }).value();
};

const removeContact = async (id) => {
  const [record] = db.get("cats").remove({ id }).write();
  return record;
};

const addContact = async (body) => {
  console.log(body);
  const id = uuid();
  const record = {
    id,
    ...body,

    // name,
    // email,
    // phone,
  };
  db.get("contacts").push(record).write();
  return record;
};

const updateContact = async (id, body) => {
  const record = db.get("contacts").find({ id }).assign(body).value();
  db.write();
  return record.id ? record : null;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
