import "dotenv/config"
import connectToDatabase from "./db.js"
import { ApolloServer } from "@apollo/server"
import { startStandaloneServer } from "@apollo/server/standalone"
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
    })

    console.log(`Server ready at ${url}`)
  } catch (error) {
    console.error("Error starting server:", error.message)
    process.exit(1)
  }
}

main()