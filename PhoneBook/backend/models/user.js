const { Schema, model } = require('mongoose')

const schema = new Schema({
  username: {
    type: String,
    required: true,
    minlength: 3
  },
  friends: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Person'
    }
  ],
})

module.exports = model('User', schema)
