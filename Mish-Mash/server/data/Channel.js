const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

let channelSchema = new mongoose.Schema({
    name: { type: String, required: true},
    description: { type: String, required: true},
    type: { type: String, required: true},
    tags: [{type: String}],
    followers: [{ type: ObjectId, ref: 'User' }]
  });

  module.exports = mongoose.model('Channel', channelSchema);