import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

export function CartItemSkeleton() {
  return (
    <SkeletonTheme baseColor="#e0e0e0" highlightColor="#f5f5f5">
      <tr>
        <td style={{ width: "526px", paddingLeft: 0 }}>
          <div className="d-flex align-items-center gap-3 p-3">
            <Skeleton width={60} height={60} borderRadius={8} />
            <div className="w-100">
              <Skeleton height={20} width="80%" />
            </div>
          </div>
        </td>
        <td>
          <div className="d-flex justify-content-end align-items-center p-3 gap-1">
            <Skeleton width={40} height={20} />
          </div>
        </td>
        <td className="text-end text-gray-500 px-5 py-3">
          <Skeleton width={30} height={20} />
        </td>
        <td style={{ width: "306px", paddingRight: 0 }}>
          <div className="d-flex justify-content-between ps-11 pe-3">
            <Skeleton width={60} height={30} /> {/* 模擬刪除按鈕 */}
            <div className="d-flex align-items-center gap-1">
              <Skeleton width={40} height={20} />
            </div>
          </div>
        </td>
      </tr>
    </SkeletonTheme>
  );
}

export function CartItemMobileSkeleton() {
  return (
    <SkeletonTheme baseColor="#e0e0e0" highlightColor="#f5f5f5">
      <div className="d-flex flex-row gap-3">
        <Skeleton width={90} height={90} borderRadius={8} />
        <div className="d-flex flex-column justify-content-between w-100">
          <div className="d-flex justify-content-between align-items-center">
            <div className="w-100">
              <Skeleton width="60%" height={20} />
            </div>
            <Skeleton width={24} height={24} circle />
          </div>
          <div className="d-flex justify-content-between">
            <Skeleton width={60} height={20} />
            <Skeleton width={30} height={20} />
          </div>
        </div>
      </div>
    </SkeletonTheme>
  );
}
