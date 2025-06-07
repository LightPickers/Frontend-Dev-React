import useBreadcrumbs from "@/hooks/useBreadcrumbs";

function Breadcrumbs() {
  const breadcrumbs = useBreadcrumbs();

  return (
    <div className="container-lg container-fluid">
      <nav className="text-truncate" aria-label="breadcrumb">
        {breadcrumbs.map(({ pathname, element }, index) => (
          <span className="text-gray-500 fw-normal" key={pathname}>
            {index > 0 && " / "}
            {element}
          </span>
        ))}
      </nav>
    </div>
  );
}

export default Breadcrumbs;
