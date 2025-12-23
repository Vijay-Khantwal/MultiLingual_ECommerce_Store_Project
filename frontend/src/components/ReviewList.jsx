export default function ReviewList({ reviews }) {
  if (!reviews?.length) {
    return <p className="text-[#6b6b6b]">No reviews yet</p>;
  }

  return (
    <div className="space-y-6">
      {reviews.map((r) => (
        <div key={r._id} className="bg-[#e8dfd7] p-5 rounded-2xl">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="font-medium text-[#3d3d3d]">
                {r.userId?.name || "User"}
              </p>

              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i}
                    className={
                      i < r.rating ? "text-[#d4a574]" : "text-[#d4cfc7]"
                    }
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>

            <span className="text-sm text-[#6b6b6b]">
              {new Date(r.createdAt).toLocaleDateString()}
            </span>
          </div>

          <p className="text-[#3d3d3d]">{r.comment}</p>
        </div>
      ))}
    </div>
  );
}
