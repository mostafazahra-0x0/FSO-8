import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import jwt from 'jsonwebtoken'
import User from './models/User.js'
import typeDefs from './schema.js'
import resolvers from './resolvers.js'

const startServer = async (port) => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  })

  const { url } = await startStandaloneServer(server, {
    listen: { port: Number(port) },
    context: async ({ req }) => {
      const auth = req ? req.headers.authorization : null
      console.log('Authorization Header:', auth)

      if (auth && auth.startsWith('Bearer ')) {
        const token = auth.substring(7)
        try {
          const secret = process.env.SECRET || process.env.JWT_SECRET
          const decodedToken = jwt.verify(token, secret)
          console.log('Decoded Token:', decodedToken)

          const currentUser = await User.findById(decodedToken.id)
          console.log('Current User found:', currentUser)

          return { currentUser }
        } catch (error) {
          console.error('JWT Error:', error.message)
        }
      }
      return {}
    },
  })

  console.log(`Server ready at ${url}`)
}

export default startServer
