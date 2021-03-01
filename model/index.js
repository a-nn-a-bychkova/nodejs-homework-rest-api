const db = require("./db");
const { v4: uuid } = require("uuid");

const listContacts = async () => {
  return db.value();
};

const getContactById = async (id) => {
  db.find({ id }).value();
};

const removeContact = async (id) => {
  const [record] = db.remove({ id }).write();
  return record;
};

const addContact = async (body) => {
  // console.log("body", body);
  const id = uuid();
  const record = {
    id,
    ...body,
  };
  // console.log("record", record);
  db.push(record).write();
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
