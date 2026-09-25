const {
  ApolloServer,
} = require('../library/library-backend/node_modules/@apollo/server')
const { MongoMemoryServer } = require('mongodb-memory-server')
const mongoose = require('../library/library-backend/node_modules/mongoose')

const interopDefault = (m) =>
  m && m.__esModule && 'default' in m ? m.default : (m?.default ?? m)

const typeDefs = interopDefault(
  require('../library/library-backend/schema.js'),
)
const resolvers = interopDefault(
  require('../library/library-backend/resolvers.js'),
)
const Author = interopDefault(
  require('../library/library-backend/models/authors.js'),
)
const Book = interopDefault(
  require('../library/library-backend/models/books.js'),
)
const User = interopDefault(
  require('../library/library-backend/models/User.js'),
)

process.env.JWT_SECRET = 'test-secret-key'

const initialAuthors = [
  { name: 'Robert Martin', born: 1952 },
  { name: 'Martin Fowler', born: 1963 },
  { name: 'Fyodor Dostoevsky', born: 1821 },
]

const initialBooks = [
  {
    title: 'Clean Code',
    published: 2008,
    authorName: 'Robert Martin',
    genres: ['refactoring'],
  },
  {
    title: 'Agile software development',
    published: 2002,
    authorName: 'Robert Martin',
    genres: ['agile', 'patterns', 'design'],
  },
  {
    title: 'Refactoring, edition 2',
    published: 2018,
    authorName: 'Martin Fowler',
    genres: ['refactoring'],
  },
  {
    title: 'Refactoring to patterns',
    published: 2008,
    authorName: 'Joshua Kerievsky',
    genres: ['refactoring', 'patterns'],
  },
  {
    title: 'Crime and punishment',
    published: 1866,
    authorName: 'Fyodor Dostoevsky',
    genres: ['classic', 'crime'],
  },
]

let mongoServer

const getExternalUri = () => {
  if (process.env.MONGODB_URI) return process.env.MONGODB_URI
  try {
    const fs = require('node:fs')
    const path = require('node:path')
    const envPath = path.join(
      __dirname,
      '../library/library-backend/.env',
    )
    const content = fs.readFileSync(envPath, 'utf8')
    const match = content.match(/^MONGODB_URI=(.+)$/m)
    if (match) return match[1].trim()
  } catch {
    // ignore
  }
  return null
}

const setupDatabase = async () => {
  try {
    mongoServer = await MongoMemoryServer.create()
    const uri = mongoServer.getUri()
    await mongoose.connect(uri)
    return
  } catch (error) {
    console.warn(
      'MongoMemoryServer failed, falling back to external MongoDB:',
      error.message.split('\n')[0],
    )
  }

  const uri = getExternalUri()
  if (!uri) {
    throw new Error(
      'No MongoDB available: memory server download failed and no MONGODB_URI found',
    )
  }
  // Use a separate test database so real data is never wiped.
  // Include pid so parallel test files (node --test runs each file
  // in its own process) don't wipe each other's data.
  await mongoose.connect(uri, { dbName: `library-test-${process.pid}` })
}

const teardownDatabase = async () => {
  if (!mongoServer) {
    // Clean up the per-process external test database
    try {
      await mongoose.connection.dropDatabase()
    } catch {
      // ignore
    }
  }
  await mongoose.connection.close()
  if (mongoServer) {
    await mongoServer.stop()
  }
}

const seedDatabase = async () => {
  await Author.deleteMany({})
  await Book.deleteMany({})
  await User.deleteMany({})

  const authorDocs = {}
  for (const authorData of initialAuthors) {
    const author = new Author(authorData)
    await author.save()
    authorDocs[authorData.name] = author
  }

  for (const bookData of initialBooks) {
    let author = authorDocs[bookData.authorName]
    if (!author) {
      author = new Author({ name: bookData.authorName })
      await author.save()
      authorDocs[bookData.authorName] = author
    }

    const book = new Book({
      title: bookData.title,
      published: bookData.published,
      author: author._id,
      genres: bookData.genres,
    })
    await book.save()
  }
}

const createTestUser = async (
  username = 'testuser',
  favoriteGenre = 'refactoring',
) => {
  const user = new User({ username, favoriteGenre })
  await user.save()
  return user
}

const createServer = () => {
  return new ApolloServer({ typeDefs, resolvers })
}

module.exports = {
  initialAuthors,
  initialBooks,
  setupDatabase,
  teardownDatabase,
  seedDatabase,
  createTestUser,
  createServer,
  Author,
  Book,
  User,
}
