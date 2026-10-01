import { useQuery } from '@apollo/client/react'
import { useState } from 'react'
import { ALL_BOOKS, ALL_GENRES, ME } from '../queries'
const Books = (props) => {
  const [genre, setGenre] = useState('')

  const result = useQuery(ALL_BOOKS, {
    variables: { genre: genre || undefined },
  })
  
  const genresResult = useQuery(ALL_GENRES)
  const meResult = useQuery(ME)
  if (!props.show) {
    return null
  }

  if (result.loading || genresResult.loading) {
    return <div>loading...</div>
  }

  const books = result.data ? result.data.allBooks : []
  const genres = genresResult.data ? genresResult.data.allGenres : []

  return (
    <div>
      <h2>books</h2>

      {genre && (
        <p>
          in genre <b>{genre}</b>
        </p>
      )}

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>

          {books.map((a) => (
            <tr key={a.id}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        <button onClick={() => setGenre('')}>all genres</button>

        {genres.map((g) => (
          <button key={g} onClick={() => setGenre(g)}>
            {g}
          </button>
        ))}
      </div>
    </div>
  )
}

export default Books