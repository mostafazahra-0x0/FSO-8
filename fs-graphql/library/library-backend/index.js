import { ApolloServer } from "@apollo/server"
import { startStandaloneServer } from "@apollo/server/standalone"
import { books } from "./books.js"
import { authors } from "./authors.js"
import { GraphQLError } from 'graphql'
import { v4 as uuidv4 } from 'uuid'

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
  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book!
    editAuthor(
        name: String!
        setBornTo: Int!
      ): Author
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
  Mutation: {
    addBook: (root, args) => {
      let author = authors.find((a) => a.name === args.author)
      if (!author) {
            author = { name: args.author, id: uuidv4(), born: null }
            authors.push(author)
          }
      const book = { ...args, id: uuidv4() }
          books.push(book)
      
          return book
    },
    editAuthor: (root, args) => {
        const author = authors.find((a) => a.name === args.name)
        
        if (!author) {
          return null
        }
    
        author.born = args.setBornTo
        return author
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
