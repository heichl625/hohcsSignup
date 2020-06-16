const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
    courseID: String,
    courseName: String,
    records: Array
});

const Enrollment = new mongoose.model("Enrollment", enrollmentSchema);

module.exports = Enrollment;