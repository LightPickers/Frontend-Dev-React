import { TextMedium } from "@/components/TextTypography";
import useBreadcrumbs from "@/hooks/useBreadcrumbs";

function Breadcrumbs() {
  const breadcrumbs = useBreadcrumbs();
  return (
    <nav>
      {breadcrumbs.map(({ pathname, element, isCurrentPage }, index) => {
        return (
          <TextMedium className="text-gray-500 fw-normal" key={pathname}>
            {index > 0 && " / "}
            {isCurrentPage ? <span className="fw-bold">{element.props?.children}</span> : element}
          </TextMedium>
        );
      })}
    </nav>
  );
}

export default Breadcrumbs;
