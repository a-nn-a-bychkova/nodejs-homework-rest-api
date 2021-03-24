const bcrypt = require("bcryptjs");
const SALT_WORK_FACTOR = 8;
const { Schema, model } = require("mongoose");
const gravatar = require("gravatar");
const { Subscription } = require("../../helpers/constants");

const userSchema = new Schema(
  {
    name: {
      type: String,
      minlength: 2,
      default: "Guest",
    },
    subscription: {
      type: String,
      enum: [Subscription.FREE, Subscription.PRO, Subscription.PREMIUM],
      default: Subscription.FREE,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      validate(value) {
        const re = /\S+@\S+\.\S+/;
        return re.test(String(value).toLowerCase());
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    avatar: {
      type: String,
      default: function () {
        return gravatar.url(this.email, { s: "250" }, true);
      },
    },
    imgIdCloud: {
      type: String,
      default: null,
    },
    token: {
      type: String,
      default: null,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
  this.password = await bcrypt.hash(this.password, salt, null);
  next();
});
// userSchema.path("email").validate(function (value) {
//   const re = /\S+@\S+\.S+/;
//   return re.test(String(value).toLowerCase());
// });
userSchema.methods.validPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};
const User = model("user", userSchema);

module.exports = User;
