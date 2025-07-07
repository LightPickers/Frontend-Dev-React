import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function ReviewCardSkeleton() {
  return (
    <main className="review-card">
      <section className="review-card-header">
        <div className="image-container shadow-sm flex-shrink-0">
          <Skeleton circle width={92} height={92} />
        </div>
        <div className="d-flex flex-column gap-2 flex-grow-1 overflow-hidden ms-3">
          <Skeleton width="60%" height={24} />
          <Skeleton width="80%" height={20} />
        </div>
      </section>

      <section className="review-card-body mt-3">
        <div className="d-flex justify-content-center align-items-center mb-2 gap-1">
          {Array.from({ length: 5 }).map((_, idx) => (
            <Skeleton
              key={idx}
              width={24}
              height={24}
              circle
              inline
              className={idx < 4 ? "me-2" : ""}
            />
          ))}
        </div>
        <div>
          <Skeleton count={3} height={24} />
        </div>
      </section>

      <section className="review-card-footer d-flex justify-content-between align-items-center mt-3">
        <div className="d-flex align-items-center gap-2">
          <Skeleton width={20} height={20} circle />
          <Skeleton width={80} height={20} />
        </div>
        <Skeleton width={20} height={20} />
      </section>
    </main>
  );
}

export default ReviewCardSkeleton;
