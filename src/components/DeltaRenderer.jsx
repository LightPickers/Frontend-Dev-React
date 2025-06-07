import DOMPurify from "dompurify";
import PropTypes, {
  arrayOf,
  bool,
  number,
  object,
  oneOf,
  oneOfType,
  shape,
  string,
} from "prop-types";
import { useMemo } from "react";

import { deltaToHtml } from "@utils/deltaToHtml";

function DeltaRenderer({ delta }) {
  const safeHtml = useMemo(() => {
    const rawHtml = deltaToHtml(delta);
    return DOMPurify.sanitize(rawHtml);
  }, [delta]);

  return <div dangerouslySetInnerHTML={{ __html: safeHtml }} />;
}

DeltaRenderer.propTypes = {
  delta: shape({
    ops: arrayOf(
      shape({
        insert: oneOfType([
          string,
          shape({
            image: string,
          }),
        ]).isRequired,
        attributes: shape({
          bold: bool,
          italic: bool,
          underline: bool,
          link: string,
          color: string,
          background: string,
          align: string,
          size: string,
          font: string,
          header: number,
          list: oneOf(["ordered", "bullet"]),
          blockquote: bool,
          "code-block": bool,
        }),
      })
    ).isRequired,
  }).isRequired,
};

export default DeltaRenderer;
