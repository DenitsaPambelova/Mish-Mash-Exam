const mongoose = require('mongoose')
const encryption = require('../utilities/encryption')
const ObjectId = mongoose.Schema.Types.ObjectId;

const REQUIRED_VALIDATION_MESSAGE = '{PATH} is required'

let userSchema = new mongoose.Schema({
  username: { type: String, required: REQUIRED_VALIDATION_MESSAGE, unique: true },
  email: { type: String, required: REQUIRED_VALIDATION_MESSAGE, unique: true },
  followedChannels: [{ type: ObjectId, ref: 'Channel' }],
  salt: String,
  hashedPass: String,
  roles: [String]
})

userSchema.method({
  authenticate: function (password) {
    return encryption.generateHashedPassword(this.salt, password) === this.hashedPass
  }
})

let User = mongoose.model('User', userSchema)

module.exports = User
module.exports.seedAdminUser = () => {
  User.find({}).then(users => {
    if (users.length > 0) return

    let salt = encryption.generateSalt()
    let hashedPass = encryption.generateHashedPassword(salt, '123456')

    User.create({
      username: 'Admin',
      email: 'admin@admin.bg',
      followedChannels: [],
      salt: salt,
      hashedPass: hashedPass,
      roles: ['Admin']
    })
  })
}
