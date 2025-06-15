import useBreakpoint from "@hooks/useBreakpoints";

function ProductCardSkeleton() {
  const isMdUp = useBreakpoint("mdUp");

  if (!isMdUp) {
    // 行動版 Skeleton
    return (
      <div className="mobile-product-card placeholder-glow">
        <div className="img-container">
          <div className="w-100 h-100 bg-gray-200" />
          <div
            className="card-badge placeholder mt-3 rounded-end"
            style={{ height: "1em", width: "3em" }}
          />
        </div>
        <div className="card-content d-flex flex-column gap-2">
          <p className="placeholder col-12 rounded" style={{ height: "2.5em" }} />
          <div className="product-price mt-auto">
            <p className="placeholder w-50 rounded" style={{ height: "1em" }} />
            <p className="placeholder w-75 rounded" style={{ height: "1.2em" }} />
          </div>
        </div>
      </div>
    );
  }

  // 桌機版 Skeleton
  return (
    <div className="card product-card placeholder-glow">
      <div className="card-image-container">
        <div className="product-image bg-gray-200 w-100 h-100" />
        <div
          className="card-badge placeholder mt-4 rounded-end"
          style={{ height: "1.5em", width: "4em" }}
        />
      </div>
      <div className="card-body d-flex flex-column gap-1">
        <p className="placeholder col-12 rounded" style={{ height: "3em" }} />
        <p className="placeholder col-6 rounded" style={{ height: "1em" }} />
        <p className="placeholder col-8 rounded" style={{ height: "1.2em" }} />
      </div>
    </div>
  );
}

export default ProductCardSkeleton;
