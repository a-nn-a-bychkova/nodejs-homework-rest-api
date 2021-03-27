const User = require("./schemas/user");

const findByEmail = async (email) => {
  return await User.findOne({ email });
};

const findById = async (id) => {
  return await User.findOne({ _id: id });
};

const create = async ({ name, phone, email, password }) => {
  const user = new User({ name, phone, email, password });
  return await user.save();
};

const updateUserSubscription = async (id, subscription) => {
  const result = await User.updateOne({ _id: id }, { subscription });
  return result;
};

const updateToken = async (id, token) => {
  return await User.updateOne({ _id: id }, { token });
};
// const updateAvatar = async (id, avatar) => {
//   return await User.updateOne({ _id: id }, { avatar});
// };

const updateAvatar = async (id, avatar, imgIdCloud) => {
  return await User.updateOne({ _id: id }, { avatar, imgIdCloud });
};
module.exports = {
  findByEmail,
  findById,
  create,
  updateToken,
  updateUserSubscription,
  updateAvatar,
};
