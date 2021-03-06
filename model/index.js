const Contact = require("./schemas/contact");

const listContacts = async () => {
  const results = await Contact.find({});
  return results;
};

const getContactById = async (id) => {
  const [result] = await Contact.find({ _id: id });
  return results;
};

const addContact = async (body) => {
  const result = await Contact.create(body);
  return result;
};

const updateContact = async (id, body) => {
  const result = await Contact.findByIdAndUpdate(
    { _id: id },
    { ...body },
    { new: true }
  );
  return result;
};

const removeContact = async (id) => {
  const result = await Cat.findByIdAndRemove({
    _id: id,
  });
  return result;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
