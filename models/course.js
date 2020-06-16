const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    courseName: String,
    date: Date,
    time: String,
    venue: String,
    quota: Number,
    tutor: String,
    description: String
})

const Course = new mongoose.model("Course", courseSchema);

module.exports = Course;