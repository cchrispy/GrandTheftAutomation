var db = require('../db/index.js'); 
var bcrypt = require('bcrypt');              //encryption module for hash and salt
var config = require('../config/config.js'); //config file that stores sensitive information

/********************* USER CONTROLLER METHODS *************************
** The following methods correspond with specific endpoints following **
** '/users'. Please refer to userRoutes.js for more information. Each **
** of the methods below query the mysql database to either retrieve   **
** from or write to the User table. Every method herein contributes   **
** to the authorization process.                                      **
************************************************************************/
var userController = {

  /********************************************************************************** 
  ** Handles POST request by querying database with username to verify user exists.**
  ** Then uses bcrypt's (encryption module) native compare function to verify the  **
  ** plain-text password (sent in request) with encrypted password (from database).**
  ** If username and password are verified, user information is saved to local     **
  ** machine's session store.                                                      ** 
  ***********************************************************************************/
  login: (req, res, next) => {
    if (req.session.user) { //check if user is already logged in
      res.json({ message: 'A user is already logged in.' })
    } else {
      db.User.findOne({ where: { username: req.body.username } })
        .then(function(user) {
          if (user === null) { //if user does not exist, user returns null
            res.json({ message: 'Username does not exist.' })
          } else {
            bcrypt.compare(req.body.password, user.dataValues.password, function(err, response) {
              if (err || !response) { //if error or response returns 'false'
                res.status(400).json({ message: 'Incorrect password.' })
              } else {
                req.session.user = user.dataValues;
                req.session.save();
                res.status(200).json({ message: 'User is now logged in with session id.' });
              }
            })
          }
        })
    }   
  },

  signup: (req, res, next) => {
    //check if user exists
    db.User.findOne({ where: { username: req.body.username } })
      .then(function(user) {
        if (user === null) {
          bcrypt.genSalt(10, function(err, salt) {
            //generate hashed password w/ salt
            bcrypt.hash(req.body.password, salt, function(err, hash) {
              //create newUser object to be inserted into db
              var newUser = {
                email: req.body.username,
                username: req.body.username,
                password: hash,
                salt: salt
              }
              //create user instance with newUser object
              db.User.create(newUser)
                //on success, respond with status 201 and message
                .then(function(createdUser) {
                  res.status(201).json({ message: 'User successfully created!' });
                })
                //on failure, respond with status 400
                .catch(function(err) {
                  console.log('error creating new user: ', err);
                  res.sendStatus(400);
                })
            })
          })
        } else {
          res.status(200).json({ message: 'User already exists.' });
        }
      });
  },

  logout: (req, res, next) => {
    req.session.destroy(function(err) {
      if (err) {
        res.status(409).send({ message: 'Error destroying session...' }); 
      } else {
        console.log('req.session is: ', req.session);
        res.status(202).send({ message: 'Session destroyed.' });
      }
    })
    
  }
}

module.exports = userController;