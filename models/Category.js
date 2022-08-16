const mongoose = require('mongoose')
const Schema = mongoose.Schema

const categorySchema = new Schema({
  name: { type: String, required: true },
  imageSrc: { type: String, default: '' },
  user: {
    ref: 'users', //посилання на id користувача
    type: Schema.Types.ObjectId,
  },
})

module.exports = mongoose.model('categories', categorySchema)
