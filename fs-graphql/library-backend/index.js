import { ApolloServer } from "@apollo/server"
import { startStandaloneServer } from "@apollo/server/standalone"
import { books } from "./books.js"
import { authors } from "./authors.js"
const typeDefs = `
  type Book {
    title: String!
    published: Int!
    author: String!
    id: String!
    genres: [String!]!
  }

  type Author {
    name: String!
    id: String!
    born: Int
  }

  type Query {
    dummy: Int
    books: [Book]!
    authors: [Author]!
    bookCount: Int!
    authorCount: Int!
    allBooks: [Book!]!
    allAuthors: [Author!]!
  }
`

const resolvers = {
  Query: {
    bookCount: () => books.length,
    authorCount: () => authors.length,
    allBooks: () => books,
    allAuthors: () => authors,
    dummy: () => 0,
    books: () => books,
    authors: () => authors,
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
