const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: 'This field is required.'
  },
  email: {
    type: String,
    required: 'This field is required.'
  },
  password: {
    type: String,
    required: 'This field is required.'
  }
});


module.exports = mongoose.model('User', userSchema);