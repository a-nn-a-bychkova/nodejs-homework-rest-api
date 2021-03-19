const mongoose = require("mongoose");
const { Schema, model, SchemaTypes } = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const { Subscription } = require("../../helpers/constants");
const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "write contact name"],
    },
    subscription: {
      type: String,
      enum: [Subscription.FREE, Subscription.PRO, Subscription.PREMIUM],
      default: Subscription.FREE,
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
contactSchema.plugin(mongoosePaginate);
const Contact = model("contact", contactSchema);

module.exports = Contact;
