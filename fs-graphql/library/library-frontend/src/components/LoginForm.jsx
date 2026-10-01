import { useState } from 'react'
import { useMutation } from '@apollo/client/react'
import { gql } from '@apollo/client'

const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
    }
  }
`

const LoginForm = ({ setToken, setError, show, setPage }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [login] = useMutation(LOGIN, {
    onCompleted: (data) => {
      const token = data.login.value
      setToken(token)
      localStorage.setItem('library-user-token', token)
      if (setPage) {
        setPage('books')
      }
      setUsername('')
      setPassword('')
    },
    onError: (error) => {
      if (setError) {
        setError(`login failed: ${error.message}`)
      }
    }
  })

  if (!show) {
    return null
  }

  const submit = (event) => {
    event.preventDefault()
    login({ variables: { username, password } })
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          <label htmlFor="username">username</label>
          <input
            id="username"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )
}

export default LoginForm