const controllers = require('../controllers')
const auth = require('./auth')

module.exports = (app) => {
  app.get('/', controllers.home.index)

  app.get('/register', controllers.users.registerGet)
  app.post('/register', controllers.users.registerPost)
  app.get('/login', controllers.users.loginGet)
  app.post('/login', controllers.users.loginPost)
  app.post('/logout', controllers.users.logout)

  app.get('/channels/create', auth.isInRole('Admin'), controllers.channels.getCreateChannel)
  app.post('/channels/create', auth.isInRole('Admin'), controllers.channels.postCreateChannel)

  app.post('/follow', auth.isAuthenticated, controllers.channels.followChannel)
  app.post('/unfollow', auth.isAuthenticated, controllers.channels.unfollowChannel)

  app.get('/channels/details/:id', auth.isAuthenticated, controllers.channels.getChannelDetails)
  app.get('/channels/followed', auth.isAuthenticated, controllers.channels.getFollowedChannels )


  app.all('*', (req, res) => {
    res.status(404)
    res.send('404 Not Found!')
    res.end()
  })
}
