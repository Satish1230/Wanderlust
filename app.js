if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const mongoose = require('mongoose');
const express = require('express');
const app = express();
// const Listing = require('./models/listing');
const path = require("path");
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
// const wrapAsync = require('./utils/wrapAsync.js');
// const ExpressError = require('./utils/ExpressError.js');
// const { Listingschema, reviewschema } = require("./schema.js")
const Review = require('./models/review');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const listingroute = require("./routes/listing.js");
const reviewroute = require("./routes/review.js")
const userroute = require("./routes/user.js")

const mongo_url = 'mongodb://127.0.0.1:27017/wanderlust'
main().then(() => console.log('MongoDB is connected'))
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect(mongo_url)
}


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"))
app.engine('ejs', ejsMate)
app.use(express.static(path.join(__dirname, 'public')));

const sessionOPtions = {    //required for session
    secret: "mysecreatcode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true
    }
}

app.get('/', (req, res) => {
    res.send('Hello World');
});

// app.get('/demouser', async (req, res) => {
//     let fakeUser = new User({    //creating a new user
//         email: 'student@gmail.com',            //inside user email
//         username: 'student'                //inside user username(though we don't have username in schema passport will automatically add it)
//     })

//     let registerUser = await User.register(fakeUser, 'helloworld');
//     res.send(registerUser);
// })

app.use(session(sessionOPtions)) //  starting sessions
app.use(flash());     //using flash to show flash messages

app.use(passport.initialize());   //initialize
app.use(passport.session());    //to avoid signup in every request
passport.use(new LocalStrategy(User.authenticate()));

// storing and deleting users data in session
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currUser = req.user;
    next();
})



app.use("/listings", listingroute)
app.use("/listings/:id/reviews", reviewroute)
app.use("/", userroute)



//error handling middleware
// app.all('*', (req, res, next) => {            //if user send a request to route which don't exist
//     next(new ExpressError('Page Not Found', 404));
// })
// app.use((err, req, res, next) => {
//     let { statuscode = 500, message = "Something went wrong" } = err;
//     // res.status(statuscode).send(message);
//     res.status(statuscode).render("error.ejs", { message })
// });

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});