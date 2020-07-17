const express = require('express');
const Course = require('../models/course');
const Enrollment = require('../models/enrollment');
const WaitingList = require('../models/waitinglist');
const AuthorizedList = require('../models/authorizedList');
const router = express.Router();


router.post("/login", (req, res) => {
    AuthorizedList.findOne({email: req.body.email+"@hohcs.org.hk"}, (err, foundEmail) => {
        if(err){
            console.log(err);
            res.sendStatus(403);
        }else{
            if(foundEmail){
                res.json(foundEmail);
            }else{
                res.sendStatus(403);
            }
        }
})});

router.post("/createcourse", (req, res) => {

    const course = req.body;

    const newCourse = new Course({
        courseName: course.courseName,
        date: course.date,
        time: course.time,
        venue: course.venue,
        quota: course.quota,
        tutor: course.tutor,
        description: course.description
    });

    console.log(newCourse);

    newCourse.save((err) => {
        if (!err) {
            res.sendStatus(200);
        } else {
            res.sendStatus(403);
        }
    })

})

router.post("/modifyCourse", (req, res) => {

    const course = req.body.course;

    Course.findOneAndUpdate({_id: course._id}, {_id: course._id, courseName: course.courseName, date: course.date, time: course.time, description: course.description, quota: course.quota, tutor: course.tutor, venue: course.venue, _v: course._v}, (err, foundCourse) => {
        if(err){
            console.log(err);
            res.sendStatus(403);
        }else{
            if(foundCourse){
                res.json(foundCourse);
            }else{
                console.log(err);
                res.json({msg: "No Course Found"});
            }
        }
    })

})

router.get("/course", (req, res) => {

    Course.find({}, (err, foundCourse) => {
        if (!err) {
            res.json(foundCourse);
        }
    })

})

router.get('/futureCourse', (req, res) => {

    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate());

    Course.find({
        date: {
            $gt: cutoff
        }
    }, (err, foundCourse) => {
        if (!err) {
            if(foundCourse){
                console.log(foundCourse);
                res.json(foundCourse);
            }else{
                console.log("No Course found");
                res.sendStatus(403);
            }
            
        }else{
            res.sendStatus(403);
        }
    }).sort('date');
})

router.post('/checkQuota', (req, res) => {

    console.log("courseID: " + req.body.courseID);

    Course.findOneAndUpdate({
        $and: [{
            _id: req.body.courseID
        }, {
            quota: {
                $gt: 0
            }
        }]
    }, {
        $inc: {
            quota: -1
        }
    }, (err, foundCourse) => {
        if (err) {
            console.log(err)
            res.sendStatus(400);
        } else {
            if (foundCourse) {
                res.json(foundCourse);
            } else {
                console.log("Can't find course");
                res.json({quota: 0});
            }
        }
    })

})

router.post('/waitinglist', (req, res) => {

    const queryData = req.body;

    const email = queryData.enrollment.email + "@hohcs.org.hk";

    const newRecord = {
        username: req.body.enrollment.username,
        email: email,
        staffid: req.body.enrollment.staffid,
        post: req.body.enrollment.post,
        dept: req.body.enrollment.dept,
        registeredBy: req.body.registeredBy
    }

    console.log("newRecord: " + newRecord);

    Course.findOne({$and: [{
        _id: queryData.enrollment.course
    }, {
        quota: {
            $eq: 0
        }
    }]
    }, (err, foundCourse) => {
        if(err){
            console.log(err);
            res.sendStatus(403);
        }else{
            if(foundCourse){
                const courseID = foundCourse._id;

                WaitingList.findOne({courseID: courseID}, (err,foundList) => {
                    if(err){
                        console.log(err);
                        res.sendStatus(403);
                    }else{
                        if(foundList){
                            WaitingList.findOneAndUpdate({courseID: courseID}, {$push: {records: newRecord}}, (err) => {
                                if(err){
                                    res.sendStatus(403);
                                }else{
                                    res.status(200);
                                }
                            })
                        }else{
                            const newList = new WaitingList({
                                courseID: courseID,
                                courseName: queryData.courseName,
                                records: [newRecord]
                            })

                            newList.save(err => {
                                if(err){
                                    res.sendStatus(403);
                                }else{
                                    res.sendStatus(200);
                                }
                            })
                        }
                        res.sendStatus(200);
                    }
                })

            }else{
                console.log("No course found")
                res.sendStatus(403);
            }
        }
    })
})

router.post('/waitinglistByCourseID', (req, res) => {

    console.log(req.body);
    const courseID = req.body.courseID;

    WaitingList.findOne({courseID: courseID}, (err, foundList) => {
        if(err){
            console.log(err);
            res.sendStatus(403);
        }else{
            if(foundList){
                res.json(foundList);
            }else{
                console.log("No List Found");
                res.sendStatus(403);
            }
        }
    })

})

router.post('/enroll', (req, res) => {

    console.log(req.body);

    const courseName = req.body.courseName;
    const email = req.body.enrollment.email + "@hohcs.org.hk";

    const newRecord = {
        username: req.body.enrollment.username,
        email: email,
        staffid: req.body.enrollment.staffid,
        post: req.body.enrollment.post,
        dept: req.body.enrollment.dept,
        registeredBy: req.body.registeredBy
    }

    Enrollment.findOne({
        courseID: req.body.courseID
    }, (err, foundEnrollment) => {

        if (err) {
            console.log(err);
            res.sendStatus(403);
        } else {

            if (foundEnrollment) {
                Enrollment.findOneAndUpdate({courseID: req.body.courseID}, {
                    $push: {
                        records: newRecord
                    }
                }, err => {
                    if (err) {
                        res.sendStatus(403)
                    } else {
                        res.sendStatus(200);
                    }
                })
            } else {
                const newEnrollment = new Enrollment({
                    courseID: req.body.courseID,
                    courseName: courseName,
                    records: [newRecord]
                })

                newEnrollment.save((err) => {
                    if (!err) {
                        res.sendStatus(200)
                    } else {
                        res.sendStatus(403)
                    }
                })
            }
        }

    });
});

router.post("/enrollDetail", (req, res) => {

    Enrollment.findOne({courseID: req.body.courseID}, (err, foundEnrollment) => {
        if(err){
            console.log(err);
            res.sendStatus(403);
        }else{
            console.log(req.body.courseID);
            if(foundEnrollment){
                console.log(foundEnrollment);
                res.json(foundEnrollment);
            }else{
                console.log("Can't find enrollment")
                res.json({message: "未有報名記錄"});
            }
        }
    })

})

router.post("/course-by-date", (req, res) => {

    const period = req.body.period;
    const today = new Date();

    var start = today.setHours(0,0,0,0);
    var end = today.setHours(23,59,59,999);

    switch(period){

        case "今天":

            Course.find({date: {$lt: end, $gte: start}}, (err, foundCourse) => {
                if(err){
                    console.log(err);
                    res.sendStatus(403);
                }else{
                    if(foundCourse){
                        res.json(foundCourse);
                    }else{
                        console.log("No course found");
                        res.send("No Course Found");
                    }
                }
            }).sort('time');
            break;
        case "過往":
            end = today.setHours(0,0,0,0);
            Course.find({date: {$lt: end}}, (err, foundCourse) => {
                if(err){
                    console.log(err);
                    res.sendStatus(403);
                }else{
                    if(foundCourse){
                        res.json(foundCourse);
                    }else{
                        console.log("No course found");
                        res.send("No Course Found");
                    }
                }
            }).sort('date');
            break;
        case "未來":
            start = today.setHours(23,59,59,999);
            Course.find({date: {$gt: start}}, (err, foundCourse) => {
                if(err){
                    console.log(err);
                    res.sendStatus(403);
                }else{
                    if(foundCourse){
                        res.json(foundCourse);
                    }else{
                        console.log("No course found");
                        res.send("No Course Found");
                    }
                }
            }).sort('date');
            break; 
        default:
            res.send("Not handle Yet");

    }
});

router.post("/register-record", (req, res) => {

    const courseID = req.body.courseID;
    const email = req.body.email;

    const courseToReturn = [];

   Enrollment.findOne({courseID: courseID}, (err, foundEnrollment) => {
      if(err){
          console.log(err);
          res.sendStatus(403);
      }else{
          if(foundEnrollment.records.length > 0){
              foundEnrollment.records.forEach(enroll => {
                  if(enroll.registeredBy === email){
                    courseToReturn.push(enroll);
                  }
              });
              res.json(courseToReturn);
          }else{
              console.log("No course found");
              res.sendStatus(403);
          }
      }
   });

})

router.post("/register-record-waitinglist", (req, res) => {

    const courseID = req.body.courseID;
    const email = req.body.email;

    const courseToReturn = [];

   WaitingList.findOne({courseID: courseID}, (err, foundEnrollment) => {
      if(err){
          console.log(err);
          res.sendStatus(403);
      }else{
          if(foundEnrollment){
              foundEnrollment.records.forEach(enroll => {
                  if(enroll.registeredBy === email){
                    courseToReturn.push(enroll);
                  }
              });
              res.json(courseToReturn);
          }else{
              console.log("No course found");
              res.sendStatus(403);
          }
      }
   });

})

router.post("/deleteCourse", (req, res) => {

    const courseID = req.body.courseID;

    Course.findByIdAndRemove(courseID, (err, foundCourse) => {
        if(err){
            console.log(err);
            res.sendStatus(403);
        }else{
            if(foundCourse){
                res.sendStatus(200);
            }else{
                console.log("No course is Found");
                res.sendStatus(403);
            }
        }
    })

})

router.post("/add-authorized-list", (req, res) => {

    const email = req.body.email;
    const role = req.body.role;

    AuthorizedList.findOne({email: email}, (err, foundEmail) => {
        if(err){
            console.log(err);
            res.sendStatus(403);
        }else{
            if(foundEmail){
                res.sendStatus(403);
            }else{

                const newItem = new AuthorizedList({
                    email: email,
                    role: role
                });

                console.log(email);

                newItem.save();

                res.sendStatus(200);
            }
        }
    })

})

router.post("/deleteEnrollment", (req, res) => {

    const courseID = req.body.courseID;
    let record;

    console.log("id: " + courseID);
    
    Enrollment.findOneAndUpdate({courseID: courseID}, {$pull: {records: req.body.enrollment}}, (err, foundCourse) => {

        if(err){
            console.log(err);
            res.sendStatus(403);
        }else{
            if(foundCourse){
                console.log("Found course in Enrollment");
                WaitingList.findOne({courseID: courseID}, (err, foundCourse) => {
                    if(err){
                        console.log(err);
                        res.sendStatus(403);
                    }else{
                        if(foundCourse){

                            if(foundCourse.records){
                                console.log("Found records in waitinglist");
                                record = foundCourse.records[0];
    
                                WaitingList.findOneAndUpdate({courseID: courseID}, {$pop: {records: -1}}, (err) => {
                                    if(err){
                                        console.log(err);
                                        res.sendStatus(403);
                                    }
                                });
    
                                Enrollment.findOneAndUpdate({courseID: courseID}, {$push: {records: record}}, (err, foundRecord) => {
                                    if(err){
                                        console.log(err);
                                        res.sendStatus(403);
                                    }else{
                                        if(foundRecord){
                                            res.sendStatus(200);
                                        }
                                    }
                                })
                            }
                        }else{

                            console.log("no records in waitinglist");
                            
                            Course.findOneAndUpdate({_id: courseID}, {$inc: {quota: 1}}, (err, foundCourse) => {
                                if(err){
                                    console.log(err);
                                    res.sendStatus(403);
                                }else{
                                    console.log(foundCourse);
                                    if(foundCourse){
                                        res.sendStatus(200);
                                    }
                                }
                            })
                        }
                    }
                })
            }
        }


    })

})

router.get("/get-authorized-list", (req, res) => {

    AuthorizedList.find({}, (err, foundList) => {
        if(err){
            console.log(err);
            res.sendStatus(403);
        }else{

            if(foundList){
                res.json(foundList);
            }else{
                res.send("No Result");
            }

        }
    })

})

router.post("/delete-authorized-list", (req, res) => {


    console.log(req.body);
    const email = req.body.email;
    console.log("email: " + email);

    AuthorizedList.deleteOne({email: email}, (err) => {
        if(err){
            console.log(err);
            res.sendStatus(403);
        }else{
            res.sendStatus(200);
        }
    })

})

module.exports = router;