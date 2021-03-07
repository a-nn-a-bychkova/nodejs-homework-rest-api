const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "write contact name"],
    },
    email: {
      type: String,
      required: [true, "write contact email"],
    },
    phone: {
      type: Number,
      required: [true, "write contact phone number"],
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const Contact = model("contact", contactSchema);

module.exports = Contact;
