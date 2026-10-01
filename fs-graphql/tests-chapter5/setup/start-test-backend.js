const { spawn } = require('child_process')
const path = require('path')
const { MongoMemoryServer } = require('mongodb-memory-server')

const start = async () => {
  let mongoServer = null
  let uri = process.env.TEST_MONGODB_URI

  if (!uri) {
    try {
      mongoServer = await MongoMemoryServer.create({
        binary: {
          version: '7.0.14',
        },
      })
      uri = mongoServer.getUri()
      console.log('Using MongoMemoryServer:', uri)
    } catch (error) {
      console.error(
        'MongoMemoryServer failed, falling back to TEST_MONGODB_URI env:',
        error.message
      )
      // Fallback: use Atlas test DB derived from backend .env
      // to avoid wiping the dev/prod Library database.
      // Set TEST_MONGODB_URI env var to override.
      const fs = require('fs')
      try {
        const envPath = path.resolve(
          __dirname,
          '../../library/library-backend/.env'
        )
        const envContent = fs.readFileSync(envPath, 'utf8')
        const match = envContent.match(/^MONGODB_URI=(.+)$/m)
        if (match) {
          uri = match[1].trim().replace('/Library?', '/LibraryTest?')
          console.log('Using fallback Atlas test DB')
        }
      } catch (e) {
        console.error('Fallback DB lookup failed:', e.message)
      }
      if (!uri) {
        console.error(
          'No MongoDB available. Set TEST_MONGODB_URI env var.'
        )
        process.exit(1)
      }
    }
  }

  const backendDir = path.resolve(__dirname, '../../library/library-backend')
  const serverProcess = spawn('node', ['index.js'], {
    cwd: backendDir,
    env: {
      ...process.env,
      NODE_ENV: 'test',
      MONGODB_URI: uri,
      JWT_SECRET: 'test-secret-key',
      PORT: '4000',
    },
    stdio: ['pipe', 'pipe', 'pipe'],
  })

  serverProcess.stdout.on('data', (data) => {
    const output = data.toString()
    process.stdout.write(output)
  })

  serverProcess.stderr.on('data', (data) => {
    process.stderr.write(data.toString())
  })

  process.on('SIGTERM', () => {
    serverProcess.kill()
    if (mongoServer) mongoServer.stop()
  })

  process.on('SIGINT', () => {
    serverProcess.kill()
    if (mongoServer) mongoServer.stop()
  })
}

start()
