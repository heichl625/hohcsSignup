const mongoose = require('mongoose');

const waitingListSchema = new mongoose.Schema({
    courseID: String,
    courseName: String,
    records: Array
});

const WaitingList = new mongoose.model("WaitingList", waitingListSchema);

module.exports = WaitingList;