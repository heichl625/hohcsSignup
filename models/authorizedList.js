const mongoose = require('mongoose');

const authorizedListSchema = new mongoose.Schema({
    email: String
})

const AuthorizedList = new mongoose.model("AuthorizedList", authorizedListSchema);

module.exports = AuthorizedList;