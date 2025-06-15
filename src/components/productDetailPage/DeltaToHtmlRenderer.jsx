import React, { useState, useEffect } from "react";
import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";
import { object, string } from "prop-types";

const DeltaToHtmlRenderer = ({ delta, className = "", config = {} }) => {
  const [html, setHtml] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!delta || !delta.ops) {
      setHtml("");
      setError("Invalid delta format");
      return;
    }

    // 預設配置選項
    const defaultConfig = {
      paragraphTag: "p",
      encodeHtml: true,
      classPrefix: "ql",
      inlineStyles: false,
      multiLineBlockquote: true,
      multiLineHeader: true,
      multiLineCodeblock: true,
      multiLineParagraph: true,
      ...config,
    };

    try {
      const converter = new QuillDeltaToHtmlConverter(delta.ops, defaultConfig);
      const convertedHtml = converter.convert();
      setHtml(convertedHtml);
      setError(null);
    } catch (err) {
      setError("轉換 Delta 資料時發生錯誤: " + err.message);
      setHtml("");
    }
  }, [delta, config]);

  if (error) {
    return <div className="delta-error">{error}</div>;
  }

  return (
    <div
      className={`delta-rendered-content ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

DeltaToHtmlRenderer.propTypes = {
  delta: object.isRequired,
  className: string,
  config: object,
};

export default DeltaToHtmlRenderer;
