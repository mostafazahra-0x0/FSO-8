import "dotenv/config"
import connectToDatabase from "./db.js"
import { ApolloServer } from "@apollo/server"
import { startStandaloneServer } from "@apollo/server/standalone"
import jwt from "jsonwebtoken"
import User from "./models/User.js"
import typeDefs from "./schema.js"
import resolvers from "./resolvers.js"

const MONGODB_URI = process.env.MONGODB_URI
const PORT = process.env.PORT || 4000

const main = async () => {
  try {
    await connectToDatabase(MONGODB_URI)
    
    const server = new ApolloServer({
      typeDefs,
      resolvers,
    })

    const { url } = await startStandaloneServer(server, {
      listen: { port: Number(PORT) },
      context: async ({ req }) => {
        const auth = req ? req.headers.authorization : null

        if (auth && auth.startsWith('Bearer ')) {
          try {
            const decodedToken = jwt.verify(auth.substring(7), process.env.JWT_SECRET)
            const currentUser = await User.findById(decodedToken.id)
            return { currentUser }
          } catch (error) {
            console.error('JWT Error:', error.message)
          }
        }
        return {}
      },
    })

    console.log(`Server ready at ${url}`)
  } catch (error) {
    console.error("Error starting server:", error.message)
    process.exit(1)
  }
}

main()