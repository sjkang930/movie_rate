import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import styles from '../../styles/Home.module.css'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../api/auth/[...nextauth].js'
import { signIn } from 'next-auth/react'
export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions)
  return {
    props: {
      session: JSON.parse(JSON.stringify(session)),
    },
  }
}

export default function Movie({ session }) {
  const router = useRouter()
  const { id } = router.query
  const [movie, setMovie] = useState({})
  const [title, setTitle] = useState(undefined)
  const [description, setDescription] = useState(undefined)
  const [genre, setGenre] = useState(undefined)
  const [year, setYear] = useState(undefined)

  useEffect(() => {
    if (id) {
      axios
        .get(`https://fdy5xesef5.execute-api.ca-central-1.amazonaws.com/movies`)
        .then((response) => {
          console.log(response.data)
          const movie = response.data?.find((movie) => movie.Id === id)
          setMovie(movie)
          setTitle(movie.Title)
          setDescription(movie.Description)
          setGenre(movie.Genre)
          setYear(movie.Year)
        })
    }
  }, [id])
  console.log(movie)

  const updateMovie = async (e) => {
    if (!session) {
      signIn()
      return
    }
    e.preventDefault()
    const response = await axios.put(
      `https://fdy5xesef5.execute-api.ca-central-1.amazonaws.com/movies/${id}`,
      {
        Id: id,
        Title: title,
        Description: description,
        Genre: genre,
        Year: year,
        CreatedAt: movie.CreatedAt,
      },
    )
    router.push('/')
  }

  return (
    <div className={styles.main}>
      <div className={styles.card}>
        <h2 className={styles.title}>Title: {title && movie?.Title}</h2>
        <div className={styles.description}>
          Description: {description && movie?.Description}
        </div>
        <div className={styles.genre}>Genre: {genre && movie?.Genre}</div>
        <div className={styles.year}>Year: {year && movie?.Year}</div>
        <div className={styles.createdAt}>
          {new Date(movie?.CreatedAt).toLocaleString()}
        </div>
        <div className={styles.buttons}></div>
        <form onSubmit={updateMovie}>
          <input
            className={styles.input}
            type="text"
            value={title ?? ''}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
          />
          <textarea
            className={styles.description_input}
            type="text"
            value={description ?? ''}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
          />
          <input
            className={styles.input}
            type="text"
            value={genre ?? ''}
            onChange={(e) => setGenre(e.target.value)}
            placeholder="Genre"
          />
          <input
            className={styles.input}
            type="number"
            value={year ?? ''}
            onChange={(e) => setYear(e.target.value)}
            placeholder="Year"
          />
          <div className={styles.buttons}>
            <button className={styles.button} onClick={() => router.back()}>
              Back
            </button>
            <button type="submit" className={styles.button}>
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
