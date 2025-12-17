import { useEffect, useState } from "react";
import { getReviews, addReview } from "../api/review_api.js";

export default function ReviewList({ productId }) {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    getReviews(productId).then(r => setReviews(r.data));
  }, [productId]);

  return (
    <>
      {reviews.map(r => (
        <p key={r._id}>{r.comment}</p>
      ))}
    </>
  );
}
