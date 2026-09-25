import mongoose from "mongoose"

const connectToDatabase = async (uri) => {
  if (!uri) {
    throw new Error("MONGODB_URI is not defined in .env file")
  }

  mongoose.set('strictQuery', false)
  await mongoose.connect(uri)
  console.log("connected to MongoDB")
}

export default connectToDatabase