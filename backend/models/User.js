const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
  {
    id: {
      type: Number,
      required: [true, 'Please add a User ID field'],
      unique: true,
    },
    name: {
      type: String,
      required: [true, 'Please add a User Name field'],
      maxLength: 255,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
