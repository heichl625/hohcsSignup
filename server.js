const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const passportLocalMongoose = require("passport-local-mongoose");
const passport = require("passport");
const cors = require('cors');
const findOrCreate = require('mongoose-findorcreate');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();

var PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI || "mongodb+srv://admin-Leo:f99h-DJkdz7EF@i@cluster0-imcsw.mongodb.net/hohcsDB?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cors());

app.use(session({
    secret: "hohcsSecret",
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: false,
        secure: false,
        maxAge: 2000000
    }
}));


app.use(passport.initialize());
app.use(passport.session());

app.use(function (req, res, next) {
    res.locals.currentUser = req.session.userId;
    next();
})


const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    name: String,
    staffid: String,
    dept: String,
    post: String,
    role: String
})

const courseSchema = new mongoose.Schema({
    courseName: String,
    date: Date,
    time: String,
    venue: String,
    quota: Number,
    tutor: String,
    description: String
})

const enrollmentSchema = new mongoose.Schema({
    courseID: String,
    courseName: String,
    records: Array
});

const waitingListSchema = new mongoose.Schema({
    courseID: String,
    courseName: String,
    records: Array
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = new mongoose.model("User", userSchema);
const Course = new mongoose.model("Course", courseSchema);
const Enrollment = new mongoose.model("Enrollment", enrollmentSchema);
const WaitingList = new mongoose.model("WaitingList", waitingListSchema);

passport.use(User.createStrategy());

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

app.use(express.static(path.join(__dirname, "client", "build")));


app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
})

app.post("/login",
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

app.post("/register", (req, res) => {

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

app.get("/isAuthenticated", checkToken, (req, res) => {

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

app.post("/user", (req, res) => {

    const username = req.body.username;

    User.findOne({
        username: username
    }, (err, foundUser) => {
        res.send(foundUser);
    })

})

app.post("/logout", (req, res) => {
    console.log("logout now");
    console.log(req.user);
    req.logout();
    res.send(true);
})

app.post("/createcourse", (req, res) => {

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

app.get("/course", (req, res) => {

    Course.find({}, (err, foundCourse) => {
        if (!err) {
            res.json(foundCourse);
        }
    })

})

app.get('/futureCourse', (req, res) => {

    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() + 7);

    Course.find({
        date: {
            $gt: cutoff
        }
    }, (err, foundCourse) => {
        if (!err) {
            res.json(foundCourse);
        }else{
            res.sendStatus(403);
        }
    }).sort('date');
})

app.get('/adminfutureCourse', (req, res) => {

    const cutoff = new Date();
    cutoff.setHours(23,59,59,999);

    Course.find({
        date: {
            $gt: cutoff
        }
    }, (err, foundCourse) => {
        if (!err) {
            res.json(foundCourse);
        }
    }).sort('date')
});

app.get("/adminPastCourse", (req, res) => {

    const cutoff = new Date()
    cutoff.setHours(0,0,0,0);

    Course.find({
        date: {
            $lt: cutoff
        }
    }, (err, foundCourse) => {
        if (!err) {
            res.json(foundCourse);
        }
    }).sort('date')

})

app.get("/adminTodayCourse", (req, res) => {

    var start = new Date();
    start.setHours(0,0,0,0);

    var end = new Date();
    end.setHours(23,59,59,999);

    Course.find({
        date: {
            $gte: start,
            $lt: end,
        }
    }, (err, foundCourse) => {
        if (!err) {
            res.json(foundCourse);
        }else{
            console.log(err);
        }
    }).sort('time')

})

app.post('/checkQuota', (req, res) => {

    const queryData = req.body;

    const date = new Date(req.body.courseDate);
    date.setUTCHours(0);
    date.setDate(date.getDate() + 1);

    Course.findOneAndUpdate({
        $and: [{
            courseName: queryData.courseName
        }, {
            date: date
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

app.post('/waitinglist', (req, res) => {

    const queryData = req.body;

    const date = new Date(req.body.courseDate);
    date.setUTCHours(0);
    date.setDate(date.getDate() + 1);

    const email = queryData.enrollment.username + "@hohcs.org.hk";

    const newRecord = {
        username: req.body.enrollment.username,
        email: email,
        staffid: req.body.enrollment.staffid,
        post: req.body.enrollment.post,
        dept: req.body.enrollment.dept,
        registeredBy: req.body.registeredBy+"@hohcs.org.hk"
    }

    Course.findOne({$and: [{
        courseName: queryData.courseName
    }, {
        date: date
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

app.post('/waitinglistByCourseID', (req, res) => {

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

app.post('/enroll', (req, res) => {

    console.log(req.body);

    const courseName = req.body.enrollment.course.split(' ')[0];
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

app.post("/enrollDetail", (req, res) => {

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

app.post("/course-by-date", (req, res) => {

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
            })
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
            })
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
            })
            break; 
        default:
            res.send("Not handle Yet");

    }
});

// db.test.aggregate([
//     // Get just the docs that contain a shapes element where color is 'red'
//     {$match: {'shapes.color': 'red'}},
//     {$project: {
//         shapes: {$filter: {
//             input: '$shapes',
//             as: 'shape',
//             cond: {$eq: ['$$shape.color', 'red']}
//         }},
//         _id: 0
//     }}
// ])

app.post("/register-record", (req, res) => {

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

app.post("/register-record-waitinglist", (req, res) => {

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

app.post("/deleteCourse", (req, res) => {

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


app.listen(PORT, () => {
    console.log("Server start at port" + PORT);
});