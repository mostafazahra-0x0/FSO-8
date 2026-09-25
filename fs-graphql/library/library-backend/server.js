import { ApolloServer } from "@apollo/server"
import { startStandaloneServer } from "@apollo/server/standalone"
import typeDefs from "./schema.js"
import resolvers from "./resolvers.js"

const startServer = async (port) => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  })

  const { url } = await startStandaloneServer(server, {
    listen: { port: Number(port) },
  })

  console.log(`Server ready at ${url}`)
}

export default startServer