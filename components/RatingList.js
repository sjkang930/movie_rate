import React from 'react'
import Image from 'next/image';
import styles from '../styles/Home.module.css'
import axios from 'axios';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { getServerSession } from 'next-auth/next';
import { authOptions } from "../pages/api/auth/[...nextauth].js"
import { signIn } from "next-auth/react"
export async function getServerSideProps(context) {
    const session = await getServerSession(context.req, context.res, authOptions)
    return {
        props: {
            session: JSON.parse(JSON.stringify(session)),
        },
    }
}

export default function RatingList({ movie, ratings, setRatings, session }) {
    const router = useRouter();
    const [showButtons, setShowButtons] = useState(false);

    const toggleEditDelete = (id) => {
        setRatings(ratings.map((rating) => {
            if (rating.Id === id) {
                rating.showButtons = !rating.showButtons;
            }
            return rating;
        }));
    }

    return (
        <div className={styles.ratingsDiv}>
            <h2>Comments</h2>
            <div className={styles.commentRateDiv}>
                {ratings && ratings.map((rating) => (
                    rating.MovieId == movie.Id ?
                        <div className={styles.rating} key={rating.Id}>
                            <div className={styles.ratingDot}
                                onClick={() => setShowButtons(!showButtons)}
                            >
                                <div className={styles.ratingDiv}>
                                    <div className={styles.ratingName}>Comment: {rating.Comment}</div>
                                    <div className={styles.ratingStars}>Stars:  {Array.from({ length: rating.Rate }, (_, i) => (
                                        <span key={i}>🌟</span>
                                    ))}</div>
                                </div>
                                <div className={styles.dots}>
                                    <Image
                                        className={styles.dots}
                                        src="/dot.png"
                                        alt="dot"
                                        width={500}
                                        height={500}
                                        onClick={() => toggleEditDelete(rating.Id)}
                                    />
                                    {rating.showButtons && (
                                        <div className={styles.ratingButtons}>
                                            <button className={styles.ratingButton}
                                                onClick={() => {
                                                    if (!session) {
                                                        signIn();
                                                        return
                                                    }
                                                    router.push(`/movies/${movie.Id}/ratings/${rating.Id}`)
                                                }}
                                            >
                                                Edit
                                            </button>
                                            <button className={styles.ratingButton}
                                                onClick={async () => {
                                                    if (!session) {
                                                        signIn();
                                                        return
                                                    }
                                                    const response = await axios.delete(`https://fdy5xesef5.execute-api.ca-central-1.amazonaws.com/ratings/${rating.Id}`);
                                                    setRatings(ratings.filter((item) => item.Id !== rating.Id));
                                                }}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        : null
                ))}
                {ratings.find((rating) => rating.MovieId == movie.Id) == undefined && <div className={styles.rating}> No comments yet</div>}
            </div>
        </div>
    );
}
