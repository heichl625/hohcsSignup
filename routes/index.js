const express = require('express');
const User = require('../models/user');
const Course = require('../models/course');
const Enrollment = require('../models/enrollment');
const WaitingList = require('../models/waitinglist');
const AuthorizedList = require('../models/authorizedList');
const passport = require("passport");
const jwt = require('jsonwebtoken');
const router = express.Router();


router.post("/login",
    passport.authenticate('local', {
        session: false
    }), (req, res) => {

        const user = {
            username: req.user.username,
            password: req.user.password

        };

        console.log(req.user);
        const token = jwt.sign(user, 'hohcs');
        console.log(token);
        return res.json({
            user,
            token
        });
    });

router.post("/register", (req, res) => {

    console.log(req.body);
    const data = req.body;

    const newUser = {
        username: data.username,
        name: data.name,
        staffid: data.staffid,
        dept: data.dept,
        post: data.post,
        role: "user"
    }

    AuthorizedList.findOne({email: newUser.username+"@hohcs.org.hk"}, (err, foundEmail) => {
        if(err){
            console.log(err);
            res.sendStatus(403);
        }else{
            if(foundEmail){
                User.register(newUser, data.password, (err, user) => {
                    if (err) {
                        console.log(err);
                        res.sendStatus(403);
                    } else {
            
                        passport.authenticate('local', {
                            session: false
                        })(req, res, () => {
                            console.log("inside authenticate");
                            const user = {
                                username: req.user.username,
                                password: req.user.password
                            };
            
                            console.log(req.user);
                            const token = jwt.sign(user, 'hohcs');
                            console.log(token);
                            return res.json({
                                user,
                                token
                            });
                        })
                    };
            
                })
            }else{
                console.log("Not Authorized");
                res.json({msg: "Not Authorized"});
            }
        }
    })

    
});

const checkToken = (req, res, next) => {
    const header = req.headers['authorization'];

    if (typeof header !== 'undefined') {
        const bearer = header.split(' ');
        const token = bearer[1];

        req.token = token;
        next();
    } else {
        //If header is undefined return Forbidden (403)
        console.log("No token is sent");
        res.sendStatus(403)
    }
}

router.get("/isAuthenticated", checkToken, (req, res) => {

    console.log("token: " + req.token);

    jwt.verify(req.token, 'hohcs', (err, authorizedData) => {

        if (err) {
            console.log(err);
            console.log('ERROR: Could not connect to the protected route');
            res.sendStatus(403);
        } else {
            res.json({
                message: 'Successful login',
                authorizedData
            });
        }


    })
})

router.post("/user", (req, res) => {

    const username = req.body.username;

    User.findOne({
        username: username
    }, (err, foundUser) => {
        res.send(foundUser);
    })

})

router.get("/logout", (req, res) => {
    console.log("logout now");
    console.log(req.user);
    req.logout();
    res.sendStatus(200);
})

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
        registeredBy: req.body.registeredBy+"@hohcs.org.hk"
    }

    console.log("newRecord: " + newRecord);

    Course.findOne({$and: [{
        _id: queryData.enrollment.course.courseID
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
        registeredBy: req.body.registeredBy+"@hohcs.org.hk"
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
    const email = req.body.username+"@hohcs.org.hk";

    const courseToReturn = [];

   Enrollment.findOne({courseID: courseID}, (err, foundEnrollment) => {
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

router.post("/register-record-waitinglist", (req, res) => {

    const courseID = req.body.courseID;
    const email = req.body.username+"@hohcs.org.hk";

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

    AuthorizedList.findOne({email: email}, (err, foundEmail) => {
        if(err){
            console.log(err);
            res.sendStatus(403);
        }else{
            if(foundEmail){
                res.sendStatus(403);
            }else{

                const newItem = new AuthorizedList({
                    email: email
                });

                console.log(email);

                newItem.save();

                res.sendStatus(200);
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