import { Meteor } from 'meteor/meteor'
import { Links } from '../imports/collections/links'
import { WebApp } from 'meteor/webapp'
import ConnectRoute from 'connect-route'

Meteor.startup(() => {
  Meteor.publish('links', function() {
    return Links.find({})
  })
})

// Executed whenever a user visits with a route like `localhost:3000/abcd`.
function onRoute(req, res, next){
  // Take the token out of the url and try to find a matching link in the links
  // collection.
  const link = Links.findOne({ token: req.params.token })
  if (link) {
    // If found a link object, redirect the user to the long URL.
    Links.update(link, { $inc: { clicks: 1 }})
    res.writeHead(307, { 'Location': link.url })
    res.end()
  } else {
    // if link object not found, send user to normal React app.
    next()
  }
}

const middleware = ConnectRoute(function(router) {
  router.get('/:token', onRoute)
})

WebApp.connectHandlers.use(middleware)
