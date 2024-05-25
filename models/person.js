const mongoose = require('mongoose')
const uri = process.env.MONGODB_URI

mongoose.set('strictQuery', false)
console.log('initiating connection with atlas cluster...')

mongoose
  .connect(uri)
  .then(() => {
    console.log('successfully connected to mongo db')
  })
  .catch((reason) => {
    console.log(reason)
    console.log(`failed to connect to mongo db REASON: ${reason.errmsg}`)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 3,
  },
  number: {
    type: String,
    validate: {
      validator: function (v) {
        return /\d{3}-\d{3}-\d{4}/.test(v)
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
    required: [true, 'User phone number required'],
    minLength: 8,
  },
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('Person', personSchema)
