import React from 'react'
import styles from '../styles/Home.module.css'
import axios from 'axios';
import { useRouter } from 'next/router';
import RatingList from './RatingList';
import { getServerSession } from 'next-auth/next';
import { authOptions } from "../pages/api/auth/[...nextauth].js"
import { signIn } from "next-auth/react"

export async function getServerSideProps(context) {
    const session = await getServerSession(context.req, context.res, authOptions)

    // if (!session) {
    //   return {
    //     redirect: {
    //       destination: '/',
    //       permanent: false,
    //     },
    //   }
    // }


    return {
        props: {
            session: JSON.parse(JSON.stringify(session)),
        },
    }
}


export default function MovieList({ movie, data, setData, ratings, setRatings, session }) {
    const router = useRouter();
    console.log(session)
    return (
        <div className={styles.card} >
            <h2 className={styles.title}>Title: {movie.Title}</h2>
            <div className={styles.description}>Description: {movie.Description}</div>
            <div className={styles.genre} >Genre: {movie.Genre}</div>
            <div className={styles.year} >Year: {movie.Year}</div>
            <div className={styles.createdAt}>{new Date(movie.CreatedAt).toLocaleString()}</div>
            <div className={styles.buttons}>
                <button className={styles.button}
                    onClick={() => {
                        if (!session) {
                            signIn();
                            return
                        }
                        router.push(`/movies/${movie.Id}`)
                    }}
                >Edit</button>
                <button className={styles.button}
                    onClick={async () => {
                        if (!session) {
                            signIn();
                            return
                        }
                        const response = await axios.delete(`https://fdy5xesef5.execute-api.ca-central-1.amazonaws.com/movies/${movie.Id}`);
                        setData(data.filter((item) => item.Id !== movie.Id));
                    }}
                >Delete</button>
            </div>
            <RatingList movie={movie} data={data} setData={setData} ratings={ratings} setRatings={setRatings} session={session} />
        </div>
    )
}
