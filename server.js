const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const cors = require('cors');
const path = require('path');
const passport = require("./passport/passport");

const routes = require('./routes');

const app = express();

var PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/hohcsDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cors());

app.use(session({
    secret: process.env.JWT_SECRECT || "hohcsSecret",
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

app.use('/', routes);

app.use(express.static(path.join(__dirname, "client", "build")));


app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
})


app.listen(PORT, () => {
    console.log("Server start at port" + PORT);
});