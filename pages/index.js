import styles from '../styles/Home.module.css'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MovieList from '../components/MovieList';
import Rating from '../components/Rating';
import { getServerSession } from 'next-auth/next';
import { authOptions } from "./api/auth/[...nextauth].js"
import { signIn } from "next-auth/react"
export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions)


  return {
    props: {
      session: JSON.parse(JSON.stringify(session)),
    },
  }
}

export default function Home({ session }) {
  const [data, setData] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [genre, setGenre] = useState('');
  const [year, setYear] = useState('');
  console.log(session)

  useEffect(() => {
    (async () => {
      const response = await axios.get('https://fdy5xesef5.execute-api.ca-central-1.amazonaws.com/movies');
      setData(response.data?.sort((a, b) => a.createdAt - b.createdAt));
    }
    )();
  }, []);
  useEffect(() => {
    (async () => {
      const response = await axios.get('https://fdy5xesef5.execute-api.ca-central-1.amazonaws.com/ratings');
      setRatings(response.data?.sort((a, b) => a.createdAt - b.createdAt));
    }
    )();
  }, []);

  const submitHandler = async (e) => {
    if (!session) {
      signIn();
      return
    }
  e.preventDefault();
  const response = await axios.post('https://fdy5xesef5.execute-api.ca-central-1.amazonaws.com/movies', {
    Title: title,
    Description: description,
    Genre: genre,
    Year: Number(year)
  });
  console.log(response.data);
  setData([...data, response.data]);
  setDescription('');
  setTitle('');
  setGenre('');
  setYear('');
}

return (
  <div className={styles.container}>
    <div className={styles.main}>
      <h1>Movie Lists</h1>
      {data?.map((movie) => (
        <MovieList key={movie.id} movie={movie} data={data} setData={setData} ratings={ratings} setRatings={setRatings} session={session} />
      ))}
      <div className={styles.input_card}>
        <div className={styles.movieDiv}>
          <h2>Add Movie 🎬🍿</h2>
          <form onSubmit={submitHandler}>
            <input className={styles.input} type="text" name="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
            <textarea className={styles.description_input} type="text" name="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
            <input className={styles.input} type="text" name="genre" value={genre} onChange={(e) => setGenre(e.target.value)} placeholder="Genre" />
            <input className={styles.input} type="number" name="year" value={year} onChange={(e) => setYear(e.target.value)} placeholder="Year" />
            <div className={styles.buttons}>
              <button className={styles.button} type="submit">Add Movie</button>
            </div>
          </form>
        </div>
        <Rating data={data} setData={setData} ratings={ratings} setRatings={setRatings} />
      </div>
    </div>
  </div>
);
}

