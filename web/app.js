(function () {
  const dialog = document.querySelector("#markdownDialog");
  const title = document.querySelector("#markdownTitle");
  const path = document.querySelector("#markdownPath");
  const body = document.querySelector("#markdownBody");
  const rawLink = document.querySelector("#markdownRawLink");
  const closeButton = document.querySelector("#markdownClose");

  if (!dialog || !title || !path || !body || !rawLink || !closeButton) return;

  const escapeHtml = (value) =>
    value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  const inlineMarkdown = (value) => {
    let output = escapeHtml(value);
    output = output.replace(/`([^`]+)`/g, "<code>$1</code>");
    output = output.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    output = output.replace(/\*([^*]+)\*/g, "<em>$1</em>");
    output = output.replace(/\[([^\]]+)\]\(([^)]+)\)/g, function (_, label, href) {
      return '<a href="' + escapeHtml(href) + '">' + label + "</a>";
    });
    return output;
  };

  const parseTable = (lines, startIndex) => {
    const rows = [];
    let index = startIndex;

    while (index < lines.length && /^\s*\|.*\|\s*$/.test(lines[index])) {
      rows.push(lines[index]);
      index += 1;
    }

    if (rows.length < 2 || !/^\s*\|?\s*:?-{3,}/.test(rows[1])) {
      return null;
    }

    const parseRow = (row) =>
      row
        .trim()
        .replace(/^\|/, "")
        .replace(/\|$/, "")
        .split("|")
        .map((cell) => inlineMarkdown(cell.trim()));

    const header = parseRow(rows[0]);
    const bodyRows = rows.slice(2).map(parseRow);

    return {
      html:
        "<table><thead><tr>" +
        header.map((cell) => "<th>" + cell + "</th>").join("") +
        "</tr></thead><tbody>" +
        bodyRows
          .map((row) => "<tr>" + row.map((cell) => "<td>" + cell + "</td>").join("") + "</tr>")
          .join("") +
        "</tbody></table>",
      nextIndex: index,
    };
  };

  const renderMarkdown = (markdown) => {
    const lines = markdown.replace(/\r\n/g, "\n").split("\n");
    const html = [];
    let paragraph = [];
    let list = null;
    let inCode = false;
    let codeLines = [];

    const flushParagraph = () => {
      if (!paragraph.length) return;
      html.push("<p>" + inlineMarkdown(paragraph.join(" ")) + "</p>");
      paragraph = [];
    };

    const flushList = () => {
      if (!list) return;
      html.push("<" + list.type + ">" + list.items.map((item) => "<li>" + inlineMarkdown(item) + "</li>").join("") + "</" + list.type + ">");
      list = null;
    };

    for (let i = 0; i < lines.length; i += 1) {
      const line = lines[i];

      if (/^```/.test(line.trim())) {
        if (inCode) {
          html.push("<pre><code>" + escapeHtml(codeLines.join("\n")) + "</code></pre>");
          inCode = false;
          codeLines = [];
        } else {
          flushParagraph();
          flushList();
          inCode = true;
        }
        continue;
      }

      if (inCode) {
        codeLines.push(line);
        continue;
      }

      if (!line.trim()) {
        flushParagraph();
        flushList();
        continue;
      }

      const table = parseTable(lines, i);
      if (table) {
        flushParagraph();
        flushList();
        html.push(table.html);
        i = table.nextIndex - 1;
        continue;
      }

      const heading = /^(#{1,6})\s+(.*)$/.exec(line);
      if (heading) {
        flushParagraph();
        flushList();
        const level = heading[1].length;
        html.push("<h" + level + ">" + inlineMarkdown(heading[2].trim()) + "</h" + level + ">");
        continue;
      }

      const quote = /^>\s?(.*)$/.exec(line);
      if (quote) {
        flushParagraph();
        flushList();
        html.push("<blockquote>" + inlineMarkdown(quote[1]) + "</blockquote>");
        continue;
      }

      const unordered = /^\s*[-*]\s+(.*)$/.exec(line);
      if (unordered) {
        flushParagraph();
        if (!list || list.type !== "ul") {
          flushList();
          list = { type: "ul", items: [] };
        }
        list.items.push(unordered[1]);
        continue;
      }

      const ordered = /^\s*\d+\.\s+(.*)$/.exec(line);
      if (ordered) {
        flushParagraph();
        if (!list || list.type !== "ol") {
          flushList();
          list = { type: "ol", items: [] };
        }
        list.items.push(ordered[1]);
        continue;
      }

      paragraph.push(line.trim());
    }

    flushParagraph();
    flushList();

    if (inCode) {
      html.push("<pre><code>" + escapeHtml(codeLines.join("\n")) + "</code></pre>");
    }

    return html.join("\n");
  };

  const fileTitle = (href) => {
    const decoded = decodeURIComponent(href.split("/").pop() || "Dokument");
    return decoded.replace(/\.md$/i, "").replace(/[-_]/g, " ");
  };

  const openMarkdown = async (href) => {
    title.textContent = fileTitle(href);
    path.textContent = href;
    rawLink.href = href;
    body.innerHTML = '<p class="markdown-loading">Lade Dokument ...</p>';
    dialog.showModal();

    try {
      const response = await fetch(href);
      if (!response.ok) throw new Error("HTTP " + response.status);
      const markdown = await response.text();
      body.innerHTML = renderMarkdown(markdown);
      body.querySelectorAll('a[href$=".md"]').forEach((link) => {
        link.addEventListener("click", (event) => {
          event.preventDefault();
          openMarkdown(link.getAttribute("href"));
        });
      });
    } catch (error) {
      body.innerHTML =
        '<p class="markdown-error">Die Markdown-Datei konnte nicht geladen werden. Starte die Webseite ueber einen lokalen Server, z. B. <code>python3 -m http.server 4173</code>, und oeffne <code>http://localhost:4173/web/</code>.</p>';
    }
  };

  document.addEventListener("click", (event) => {
    const link = event.target.closest('a[href$=".md"]');
    if (!link) return;
    event.preventDefault();
    openMarkdown(link.getAttribute("href"));
  });

  closeButton.addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
})();
