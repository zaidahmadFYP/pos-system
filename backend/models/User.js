const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: String,
    displayName: String,
    username: String,
    email: String,
    password: String,
    plainPassword: String,
    role: String,
    registeredModules: Array
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
