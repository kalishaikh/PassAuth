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
router.get('/login', (req,res) => res.render('login')); //render vs send. If you render it uses html/css/JS

//Register Page
router.get('/register', (req,res) => res.render('register'));

router.get('/dashboard', (req,res) => res.render('dashboard'));

//Register Handle
router.post('/register', (req,res) => {
    /*
    console.log(req.body)
    res.send('hello');
    ***Send will display text plainly with no CSS
    */
    const { name, email, password, password2} = req.body;
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
  const favSaying = req.body.testerinput;
  const email = req.user.email;
  console.log("email is: " + email);
  User.findOneAndUpdate({email:email}, {"$pull": {tasks:favSaying}}).then(user =>{
    console.log(favSaying);
    req.flash('store_msg', 'Task Completed!');
    res.redirect('/views/dashboard');
  })
    .catch(err => console.log(err));
});

router.route('/deleteTask').post(function (req, res){ 
  const favSaying = req.body.deletedTask;
  const email = req.user.email;
  User.findOneAndUpdate({email:email}, {"$pull" : {tasks:favSaying}}, {returnOriginal: false}).then(user =>{
    console.log("success");
    res.send(req.user.tasks);
  })
  .catch(err => console.log(err)); 
  console.log("Tasks are" + req.user.tasks);
});

router.route('/addedTask').post(function (req, res){
  const newTask = req.body.addedTask;
  const email = req.user.email;

  User.findOneAndUpdate({email:email}, {"$push" : {tasks:newTask}}).then (user => {
    console.log("Task Added");
  })
  .catch (err => console.log(err));
  res.send(req.user.tasks);
});

router.route('/editTask').post(function (req,res){
  const newEntry = req.body.update.newEntry;
  const oldEntry = req.body.update.original_val;
  const email = req.user.email;
  console.log("old Entry is " + oldEntry);
  console.log("new Entry is " + newEntry);

  User.findOneAndUpdate({email:email, tasks:oldEntry},{"$set" : {"tasks.$" : newEntry}}, {returnNewDocument : true}).then(
    user => {
      console.log("task updated");
    })
    .catch(err => console.log(err));  
});


module.exports = router;