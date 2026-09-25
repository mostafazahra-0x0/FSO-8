const { connect } = require('mongoose')
const connectToDatabase = async (uri) => {
  if (!uri) {
    console.log('MONGODB_URI not set, skipping database connection')
    return false
  }
  console.log('connecting to database...')

  try {
    await connect(uri, { serverSelectionTimeoutMS: 5000 })
    console.log('connected to MongoDB')
    return true
  } catch (error) {
      console.log('error connection to MongoDB:', error.message)
      process.exit(1)
  }
}

module.exports = connectToDatabase