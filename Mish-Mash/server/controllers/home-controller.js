const Channel = require('mongoose').model('Channel');
const User = require('mongoose').model('User');

module.exports = {
  index: (req, res) => {
    if (req.user) {
      let currentUserId = req.user._id

      User.findById(currentUserId).populate('followedChannels').then((user) => {
        let currentTags = [];
        for (let channel of user.followedChannels) {
          for (let tag of channel.tags) {
            if (!currentTags.includes(tag)) {
              currentTags.push(tag);
            }
          }
        }
        Channel.find({ tags: { $all: currentTags } }).then((suggestChanels) => {
          let sugsChans = [];
          for (let ch of suggestChanels) {
            if (!ch.followers.includes(currentUserId)) {
              sugsChans.push(ch)
            }
          }

          Channel.find().then((allChannels) => {
            let otherChanels = [];
            for (let chan of allChannels) {
              if (!chan.followers.includes(currentUserId)) {
                otherChanels.push(chan)
              }
            }
            res.render('home/index', { user, otherChanels, sugsChans })
          }).catch((err) => {
            res.locals.globalError = err.message;
            res.render('home/index')
          })
        })


      })


    } else {
      res.render('home/index')
    }
  },


}
