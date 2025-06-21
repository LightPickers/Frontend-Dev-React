function escapeHtml(text) {
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    // eslint-disable-next-line quotes
    '"': "&quot;",
    "'": "&#39;",
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

function getStyleFromAttrs(attrs = {}) {
  const styles = [];

  if (attrs.color) styles.push(`color: ${attrs.color}`);
  if (attrs.background) styles.push(`background-color: ${attrs.background}`);
  if (attrs.align) styles.push(`text-align: ${attrs.align}`);
  if (attrs.size) {
    const sizeMap = {
      small: "0.75em",
      normal: "1em",
      large: "1.5em",
      huge: "2em",
    };
    styles.push(`font-size: ${sizeMap[attrs.size] || attrs.size}`);
  }
  if (attrs.font) {
    const fontMap = {
      serif: "serif",
      monospace: "monospace",
      sans: "sans-serif",
    };
    styles.push(`font-family: ${fontMap[attrs.font] || attrs.font}`);
  }

  return styles.length ? ` style="${styles.join("; ")}"` : "";
}

export function deltaToHtml(delta) {
  const html = [];
  let listType = null;
  let listBuffer = [];

  const flushList = () => {
    if (listBuffer.length > 0 && listType) {
      const tag = listType === "ordered" ? "ol" : "ul";
      html.push(`<${tag}>${listBuffer.join("")}</${tag}>`);
      listBuffer = [];
      listType = null;
    }
  };

  for (const op of delta.ops) {
    if (typeof op.insert === "string") {
      const lines = op.insert.split("\n");

      lines.forEach((line, idx) => {
        if (line === "" && idx === lines.length - 1) return;

        const attrs = op.attributes || {};
        let text = escapeHtml(line);

        if (attrs.bold) text = `<strong>${text}</strong>`;
        if (attrs.italic) text = `<em>${text}</em>`;
        if (attrs.underline) text = `<u>${text}</u>`;
        if (attrs.link) {
          const href = escapeHtml(attrs.link);
          text = `<a href="${href}" target="_blank" rel="noopener noreferrer">${text}</a>`;
        }

        const style = getStyleFromAttrs(attrs);

        if (attrs["code-block"]) {
          flushList();
          html.push(`<pre${style}><code>${text}</code></pre>`);
        } else if (attrs.blockquote) {
          flushList();
          html.push(`<blockquote${style}>${text}</blockquote>`);
        } else if (attrs.list) {
          const currentList = attrs.list === "ordered" ? "ordered" : "bullet";
          if (!listType) listType = currentList;
          if (listType !== currentList) {
            flushList();
            listType = currentList;
          }
          listBuffer.push(`<li${style}>${text}</li>`);
        } else {
          flushList();
          const block = attrs.header ? `h${attrs.header}` : "p";
          html.push(`<${block}${style}>${text}</${block}>`);
        }
      });
    } else if (op.insert.image) {
      flushList();
      const src = escapeHtml(op.insert.image);
      html.push(`<p><img src="${src}" alt="" /></p>`);
    }
  }

  flushList();

  return html.join("");
}
