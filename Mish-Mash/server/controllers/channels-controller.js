const Channel = require('mongoose').model('Channel');
const User = require('mongoose').model('User');
const auth = require('../config/auth')

module.exports = {
    getCreateChannel: (req, res) => {
        res.render('channels/create');
    },

    postCreateChannel: (req, res) => {
        let reqBody = req.body;
        let tagsArray = reqBody.tags.split(',').map(t => t.trim()).filter(Boolean);

        let channelObj = {
            name: reqBody.name,
            description: reqBody.description,
            type: reqBody.type,
            tags: tagsArray,
            followers: []
        }

        Channel.create(channelObj).then((channel) => {
            res.redirect('/')
        }).catch((err) => {
            res.locals.globalError = err.message;
            res.render('channels/create')
        })
    },

    followChannel: (req, res) => {
        let channelId = req.body.followId;
        let currentUserId = req.user._id;

        Channel.findById(channelId).then((channel) => {
            if (!channel.followers.includes(currentUserId)) {
                channel.followers.push(currentUserId);
                channel.save();
            }
        }).catch((err) => {
            res.locals.globalError = err.message;
            res.redirect('/')
        })

        User.findById(currentUserId).then((user) => {
            if (!user.followedChannels.includes(channelId)) {
                user.followedChannels.push(channelId);
                user.save();
            }
        }).catch((err) => {
            res.locals.globalError = err.message;
            res.redirect('/')
        })

        res.render('home/index')
    },

    unfollowChannel: (req, res) => {
        let channelId = req.body.unfollowId;
        let currentUserId = req.user._id;

        Channel.findById(channelId).then((channel) => {
            if (channel.followers.includes(currentUserId)) {
                channel.followers.splice(channel.followers.indexOf(currentUserId), 1);
                channel.save();
            }
        }).catch((err) => {
            res.locals.globalError = err.message;
            res.redirect('/')
        })

        User.findById(currentUserId).then((user) => {
            if (user.followedChannels.includes(channelId)) {
                user.followedChannels.splice(user.followedChannels.indexOf(channelId), 1);
                user.save();
            }
        }).catch((err) => {
            res.locals.globalError = err.message;
            res.redirect('/')
        })

    },

    getChannelDetails: (req, res) => {
        let channelId = req.params.id;

        Channel.findById(channelId).populate('followers').then((channel) => {
            res.render('channels/details', { channel })
        })
    },

    getFollowedChannels: (req, res) => {
        let currentUserId = req.user._id;
        User.findById(currentUserId).populate('followedChannels').then((user) => {
            res.render('channels/followed', { user })
        })
    }

}