const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
/* A router is used in node.js to send a user to a certain destination, it will have a request and a result
*/

//Passport
require('../config/passport')(passport);

//Model 
const User = require('../models/User');
//Login Page
router.get('/login', (req,res) => res.render('Login')); //render vs send. If you render it uses html/css/JS

//Register Page
router.get('/register', (req,res) => res.render('Register'));

//Register Handle
router.post('/register', (req,res) => {
    /*
    console.log(req.body)
    res.send('hello');
    ***Send will display text plainly with no CSS
    */
    const { name, email, password, password2} = req.body;
    console.log(req.body);
    let errors = [];

    //Check for required fields
    if(!name || !email || !password || !password2){
        errors.push({msg: "Please fill in all fields"});
    }

    //Check for password length
    if(password < 6){
        errors.push({msg: "Password must be at least 6 characters long"});
    }

    if(password != password2){
        errors.push({msg: "Passwords do not match"});
    }

        if (errors.length > 0) {
            res.render('register', {
              errors,
              name,
              email,
              password,
              password2
            });
          } else {
            User.findOne({ email: email }).then(user => {
              if (user) {
                errors.push({ msg: 'Email already exists' });
                res.render('register', {
                  errors,
                  name,
                  email,
                  password,
                  password2
                });
              } else {
                const newUser = new User({
                  name,
                  email,
                  password,
                  favSaying : '',
                });
                //Hash Password
                bcrypt.genSalt(10, (err,salt) => bcrypt.hash(newUser.password,salt, (err,hash) => {
                    if(err) throw err;
                
                newUser.password = hash;
                //Set Password to hash
                newUser.save() //gives us a promise so wwe need to do a .then and .next
                .then(user => {
                    req.flash('success_msg','You have successfully registered!');
                    res.redirect('/users/login');
                })
                .catch(err => console.log(err));
            }))

            }
            });
    }
});

//Handle the Login
router.post('/login',(req,res,next) =>{
  passport.authenticate('local',{
      successRedirect: '../views/dashboard',
      failureRedirect: '/users/login',
      failureFlash: true
  })(req,res,next);
});

//Handle the Logout
router.get('/logout', (req, res) => {
  req.logOut();
  req.flash('success_msg', 'You are logged out!');
  res.redirect('/users/login');
});

//Handle the fav saying
router.post('/dashboard', (req,res) => {
  const {favSaying} = req.body;
  console.log(favSaying);
  const email = 'kaasimshaikh2026@gmail.com';
  User.findOneAndUpdate({email:email, favSaying:favSaying}).then(user =>{
    req.flash('store_msg', 'Your phrase has been stored!');
    res.redirect('/views/dashboard');
    console.log("Updated");
  })
    .catch(err => console.log(err));
});

module.exports = router;