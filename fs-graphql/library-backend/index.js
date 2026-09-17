import { ApolloServer } from "@apollo/server"
import { startStandaloneServer } from "@apollo/server/standalone"
import { books } from "./books.js"
import { authors } from "./authors.js"
import { GraphQLError } from 'graphql'
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
    bookCount: Int!
  }

  type Query {
    dummy: Int
    books: [Book]!
    authors: [Author]!
    bookCount: Int!
    authorCount: [Author!]!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
  }
`

const resolvers = {
  Query: {
    bookCount: () => books.length,
    authorCount: () => authors.length,
    allBooks: (root, args) => {
      let filteredBooks = books
    
      if (args.author) {
        filteredBooks = filteredBooks.filter((b) => b.author === args.author)
      }
    
      if (args.genre) {
        filteredBooks = filteredBooks.filter((b) => b.genres.includes(args.genre))
      }
    
      return filteredBooks
    },
    allAuthors: () => authors,
    dummy: () => 0,
    books: () => books,
    authors: () => authors,
  },
  Author: {
      bookCount: (root) => {
        return books.filter((b) => b.author === root.name).length
    },
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
