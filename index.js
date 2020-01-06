/*Express allows you to implement servers a lot easier. It is a frameork that quickly sets up routes
and reduces the code */

const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const app = express();
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

require('./config/passport')(passport);

//EJS
app.use(expressLayouts);
app.set('view engine','ejs');

//
app.use('/views',express.static('styles'));

//DB Config
const db = require('./config/keys').MongoURI;

//Connect to Mongo
mongoose.set('useFindAndModify', false);
mongoose.set('useUnifiedTopology', true);
mongoose.connect(db, { useNewUrlParser: true })
.then(() => console.log('MongoDB connected...'))
.catch(err => console.log(err));

//Bodyparser
app.use(express.urlencoded({extended: false}));

//Session
app.use(session({
    secret: 's',
    resave: true,
    saveUninitialized: true
}));

//Passport
app.use(passport.initialize());
app.use(passport.session());

//Connect flash
app.use(flash());

//Vars
app.use((req,res,next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.store_msg = req.flash('store_msg');
    next();
});

//Routes
app.use('/', require('./routes/index2')); //The first comment is where the webpage routes to, the second is the js file
app.use('/users', require('./routes/users'));


const PORT = process.env.PORT || 5000; 

app.listen(PORT, console.log(`Server started on Port  ${PORT}`));

