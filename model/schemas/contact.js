const mongoose = require("mongoose");
const { Schema, model, SchemaTypes } = require("mongoose");

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
    owner: {
      type: SchemaTypes.ObjectId,
      ref: "user",
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const Contact = model("contact", contactSchema);

module.exports = Contact;
