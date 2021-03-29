const User = require("./schemas/user");

const findByEmail = async (email) => {
  return await User.findOne({ email });
};

const findById = async (id) => {
  return await User.findOne({ _id: id });
};

const create = async ({ name, phone, email, password,verify,verificationToken }) => {
  const user = new User({ name, phone, email, password,verify,verificationToken });
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
const updateVerificationToken = async (id, verify, verificationToken) => {
  return await User.findOneAndUpdate({ _id: id }, { verify, verificationToken }) // [1]
}

const findByVerificationToken = async (verificationToken) => {
  return await User.findOne({verificationToken})
}

module.exports = {
  findByEmail,
  findById,
  create,
  updateToken,
  updateUserSubscription,
  updateAvatar,
  findByVerificationToken,
  updateVerificationToken
};
