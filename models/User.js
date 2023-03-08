const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    verified: {
      type: Boolean,
      default: false,
      required: true
    },
    confirmationCode: {
      type: String,
      unique: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
