import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import styles from '../../../../styles/Home.module.css'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../../api/auth/[...nextauth].js'
import { signIn } from 'next-auth/react'
export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions)
  return {
    props: {
      session: JSON.parse(JSON.stringify(session)),
    },
  }
}

export default function Rating({ session }) {
  const router = useRouter()
  const { id, Id } = router.query
  const [rating, setRating] = useState({})
  const [comment, setComment] = useState(undefined)
  const [stars, setStars] = useState(undefined)
  console.log(rating)

  useEffect(() => {
    ;(async () => {
      const result = await axios.get(
        `https://fdy5xesef5.execute-api.ca-central-1.amazonaws.com/ratings`,
      )
      console.log(result.data)
      const rating = result.data?.find((data) => data.Id == Id)
      console.log(rating)
      setRating(rating)
      setComment(rating.Comment)
      setStars(rating.Rate)
    })()
  }, [Id])

  const ratingUpdateHandler = async (e) => {
    e.preventDefault()
    if (!session) {
      signIn()
      return
    }
    const response = await axios.put(
      `https://fdy5xesef5.execute-api.ca-central-1.amazonaws.com/ratings/${Id}`,
      {
        Id: Id,
        Comment: comment,
        Rate: stars,
        MovieId: id,
        CreatedAt: rating.CreatedAt,
      },
    )
    router.push('/')
  }

  return (
    <div className={styles.main}>
      <div className={styles.card}>
        <h2 className={styles.title}>Edit Comment</h2>
        <div className={styles.commentRateDiv}>
          <div className={styles.ratingDiv}>
            <div className={styles.ratingName}>Comment: {rating?.Comment}</div>
            <div className={styles.ratingStars}>Stars: {rating?.Rate}</div>
          </div>
          <div>
            <textarea
              className={styles.input}
              type="text"
              name="comment"
              placeholder="Comment"
              onChange={(e) => setComment(e.target.value)}
              value={comment}
            />
            <input
              className={styles.input}
              type="number"
              name="rating"
              placeholder="Rating"
              min="1"
              max="10"
              step="1"
              onChange={(e) => setStars(e.target.value)}
              value={stars}
            />
          </div>
          <div className={styles.buttons}>
            <button className={styles.button} onClick={() => router.back()}>
              Back
            </button>
            <button className={styles.button} onClick={ratingUpdateHandler}>
              Update Comment
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
