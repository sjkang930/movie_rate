import styles from '../styles/Home.module.css'
import axios from 'axios';
import { useState } from 'react';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../pages/api/auth/[...nextauth].js';
import { signIn } from 'next-auth/react';

export async function getServerSideProps(context) {
    const session = await getServerSession(context.req, context.res, authOptions);
    return {
        props: {
            session: JSON.parse(JSON.stringify(session)),
        },
    };
}

export default function Rating({ data, setData, ratings, setRatings, session }) {
    const [movieRateTitle, setMovieRateTitle] = useState('');
    const [movieRateComment, setMovieRateComment] = useState('');
    const [movieRateRating, setMovieRateRating] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!session) {
            signIn();
            return
        }
        const movie = data.find((movie) => movie.Title === e.target.movie.value);
        const response = await axios.post(`https://fdy5xesef5.execute-api.ca-central-1.amazonaws.com/movies/${movie.Id}/ratings`, {
            MovieId: movie.Id,
            Comment: e.target.comment.value,
            Rate: e.target.rating.value,
        });
        console.log("response.data", response.data);
        setRatings([...ratings, response.data]);
        setMovieRateComment('');
        setMovieRateRating('');
        // router.push(`/movies/${movie.Id}`);
    }

    return (
        <div className={styles.rateDiv}>
            <h2>Rating Movie 🌟</h2>
            <form onSubmit={handleSubmit}>
                <select className={styles.input}
                    name="movie"
                    id="movie"
                    value={movieRateTitle}
                    onChange={(e) => setMovieRateTitle(e.target.value)}>
                    {data?.map((movie) => (
                        <option key={movie.id} value={movie.Title}>{movie.Title}</option>
                    ))}
                </select>
                <textarea className={styles.input} type="text" name="comment" placeholder="Comment"
                    onChange={(e) => setMovieRateComment(e.target.value)} value={movieRateComment} />
                <input className={styles.input} type="number" name="rating" placeholder="Rating"
                    min="1" max="10" step="1"
                    onChange={(e) => setMovieRateRating(e.target.value)} value={movieRateRating}
                />
                <div className={styles.buttons}>
                    <button className={styles.button} type="submit">Add Rate</button>
                </div>
            </form>
        </div>
    )
}
