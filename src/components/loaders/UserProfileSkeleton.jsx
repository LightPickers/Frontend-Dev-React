import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function UserProfileSkeleton() {
  return (
    <div className="container py-0 mt-0">
      <div className="row">
        <div className="col-12">
          <div className="mb-3">
            <div className="small mb-1 fw-bold text-muted">使用者帳號</div>
            <Skeleton width={200} height={20} />
          </div>

          <div className="mb-3">
            <label className="form-label">密碼</label>
            <Skeleton height={38} />
          </div>

          <div className="mb-3">
            <div className="small mb-1 fw-bold text-muted">姓名</div>
            <Skeleton width={200} height={20} />
          </div>

          <div className="mb-3">
            <div className="small mb-1 fw-bold text-muted">電話</div>
            <Skeleton width={200} height={20} />
          </div>

          <div className="mb-3">
            <label className="small mb-1 fw-bold text-muted">性別</label>
            <div className="d-flex gap-3">
              <Skeleton circle width={20} height={20} />
              <Skeleton circle width={20} height={20} />
              <Skeleton circle width={20} height={20} />
            </div>
          </div>

          <div className="mb-3 d-flex align-items-center gap-2">
            <label className="small mb-1 fw-bold text-muted">生日</label>
            <Skeleton height={38} width={200} />
          </div>

          <div className="mb-3">
            <label className="small mb-1 fw-bold text-muted">地址</label>
            <div className="mb-2">
              <Skeleton width={180} height={38} style={{ marginRight: "1rem" }} />
              <Skeleton width={180} height={38} />
            </div>
            <Skeleton height={38} />
          </div>

          <Skeleton height={46} width={"100%"} borderRadius={8} />
        </div>
      </div>
    </div>
  );
}

export default UserProfileSkeleton;
