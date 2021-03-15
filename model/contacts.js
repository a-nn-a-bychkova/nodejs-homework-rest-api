const Contact = require("./schemas/contact");

const listContacts = async (userId) => {
  const results = await Contact.find({ owner: userId }).populate({
    path: "owner",
    select: "name email subscription -_id",
  });
  return results;
};

const getContactById = async (id, userId) => {
  // const [result]
  const result = await Contact.findOne({ _id: id, owner: userId }).populate({
    path: "owner",
    select: "name email subscription -_id",
  });
  return results;
};

const addContact = async (body) => {
  const result = await Contact.create(body);
  return result;
};

const updateContact = async (id, body, userId) => {
  const result = await Contact.findByIdAndUpdate(
    { _id: id, owner: userId },
    { ...body },
    { new: true }
  );
  return result;
};

const removeContact = async (id, userId) => {
  const result = await Contact.findByIdAndRemove({
    _id: id,
    owner: userId,
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
