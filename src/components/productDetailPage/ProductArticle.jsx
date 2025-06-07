import React from "react";
import { object } from "prop-types";

import { H4Primary, H5Primary, H6Primary } from "@/components/Headings";
import { TextLarge, TextMedium } from "@components/TextTypography";

let uniqueKey = 0; // 處理渲染 key 值

function getArticleStyle(attrs = {}, children) {
  if (attrs.header === 1) {
    return <H4Primary className="mb-2">{children}</H4Primary>;
  }
  if (attrs.header === 2) {
    return <H5Primary className="mb-2">{children}</H5Primary>;
  }
  if (attrs.header === 3) {
    return <H6Primary className="mb-2">{children}</H6Primary>;
  }
  if (attrs.size === "small") {
    return <TextMedium className="mb-1">{children}</TextMedium>;
  }

  const style = {};
  if (attrs.color) style.color = attrs.color;

  return (
    <TextLarge className="mb-1" style={style}>
      {children}
    </TextLarge>
  );
}

function applyInlineStyles(text, attrs = {}) {
  let node = text;

  if (attrs.link) {
    node = (
      <a href={attrs.link} target="_blank" rel="noopener noreferrer">
        {node}
      </a>
    );
  }
  if (attrs.underline) node = <u>{node}</u>;
  if (attrs.italic) node = <em>{node}</em>;
  if (attrs.bold) node = <strong>{node}</strong>;

  return node;
}

function ProductArticle({ delta }) {
  const elements = [];

  let listBuffer = [];
  let currentListType = null;

  const flushList = () => {
    if (listBuffer.length === 0) return;

    const ListTag = currentListType === "ordered" ? "ol" : "ul";

    elements.push(
      <ListTag className="mb-2 list-inside pl-4" key={`list-${uniqueKey++}`}>
        {listBuffer.map(item => (
          <li key={`item-${uniqueKey++}`}>{item}</li>
        ))}
      </ListTag>
    );

    listBuffer = [];
    currentListType = null;
  };

  for (const op of delta.ops) {
    if (typeof op.insert === "string") {
      const lines = op.insert.split("\n");
      const attrs = op.attributes || {};

      lines.forEach((line, index) => {
        if (line === "" && index === lines.length - 1) return;

        const content = applyInlineStyles(line, attrs);

        if (attrs.list) {
          // 若 list 類型改變，就 flush 並開始新 list
          if (currentListType && currentListType !== attrs.list) {
            flushList();
          }
          currentListType = attrs.list;
          listBuffer.push(content);
        } else {
          flushList(); // 非列表則先把舊的 flush 掉
          elements.push(
            <React.Fragment key={`block-${uniqueKey++}`}>
              {getArticleStyle(attrs, content)}
            </React.Fragment>
          );
        }
      });
    } else if (op.insert.image) {
      flushList();
      elements.push(
        <div className="my-2" key={`img-${uniqueKey++}`}>
          <img src={op.insert.image} alt="" className="max-w-full h-auto" />
        </div>
      );
    }
  }

  flushList(); // 處理結尾的列表

  return <>{elements}</>;
}

ProductArticle.propTypes = {
  delta: object.isRequired,
};

export default ProductArticle;
