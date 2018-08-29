const encryption = require('../utilities/encryption')
const User = require('mongoose').model('User')

module.exports = {
  registerGet: (req, res) => {
    res.render('users/register')
  },
  registerPost: (req, res) => {
    let reqUser = req.body

    if (!reqUser.password || reqUser.password !== reqUser.confirmPassword) {
      res.locals.globalError = 'Missing or mismatch password.';
      res.render('users/register', reqUser);
      return;
    }

    let salt = encryption.generateSalt()
    let hashedPassword = encryption.generateHashedPassword(salt, reqUser.password)

    User.create({
      username: reqUser.username,
      email: reqUser.email,
      followedChannels: [],
      salt: salt,
      hashedPass: hashedPassword,
      roles: []
    }).then(user => {
      req.logIn(user, (err, user) => {
        if (err) {
          res.locals.globalError = err
          res.render('users/register', user)
        }

        res.redirect('/')
      })
    }).catch(err => {
      res.locals.globalError = 'Please choose another email, this is busy!'

      if (err.name === 'ValidationError') {
        let errorMessages = ''
        for (field in err.errors)
          errorMessages += capitalize(field) + ' is required.\r\n'
        if (!reqUser.password)
          errorMessages += capitalize('password') + ' is required.\r\n'
        res.locals.globalError = errorMessages
      }

      res.render('users/register', reqUser)
    })
  },

  loginGet: (req, res) => {
    res.render('users/login')
  },
  loginPost: (req, res) => {
    let reqUser = req.body

    if (!reqUser || !reqUser.username || !reqUser.password) {
      res.locals.globalError = 'Invalid credentials.'
      return res.render('users/login', userToLogin)
    }

    User
      .findOne({ username: reqUser.username }).then(user => {
        if (!user) {
          res.locals.globalError = 'Invalid user data'
          res.render('users/login')
          return
        }

        if (!user.authenticate(reqUser.password)) {
          res.locals.globalError = 'Invalid user data'
          res.render('users/login')
          return
        }

        req.logIn(user, (err, user) => {
          if (err) {
            res.locals.globalError = err
            res.render('users/login')
          }

          res.redirect('/')
        })
      })
  },
  logout: (req, res) => {
    req.logout()
    res.redirect('/')
  }
}
