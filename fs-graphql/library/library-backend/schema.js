const typeDefs = `
  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }
  type Book {
    title: String!
    published: Int!
    author: Author!
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
    me: User
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
      createUser(
            username: String!
            favoriteGenre: String!
          ): User
          login(
            username: String!
            password: String!
          ): Token
  }
`;
export default typeDefs;
