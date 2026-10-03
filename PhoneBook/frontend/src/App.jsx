import { ALL_PERSONS, PERSON_ADDED } from './queries'
import PersonForm from './components/PersonForm'
import Notify from './components/Notify'
import PhoneForm from './components/PhoneForm'
import { useState } from 'react'
import LoginForm from './components/LoginForm'
import Persons from './components/Persons'

import { useApolloClient, useQuery, useSubscription } from '@apollo/client/react'

const App = () => {
  const [errorMessage, setErrorMessage] = useState(null)
  const result = useQuery(ALL_PERSONS)
  const client = useApolloClient()
  const [token, setToken] = useState(localStorage.getItem('phonebook-user-token'))
  useSubscription(PERSON_ADDED, {
    onData: ({ data }) => {
      const addedPerson = data.data.personAdded
      notify(`${addedPerson.name} added`)
    },
  })
  if (result.loading) {
    return <div>loading...</div>
  }
  
  const onLogout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }
  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 10000)
  }
  if (!token) {
    return (
      <div>
        <Notify errorMessage={errorMessage} />
        <h2>Login</h2>
        <LoginForm
          setToken={setToken}
          setError={notify}
        />
      </div>
    )
  }
  return (
    <div>
      <Persons persons={result.data.allPersons} />
      <Notify errorMessage={errorMessage} />
      <button onClick={onLogout}>logout</button>
      <PersonForm setError={notify} />
      <PhoneForm setError={notify} />
    </div>
  )
}

export default App