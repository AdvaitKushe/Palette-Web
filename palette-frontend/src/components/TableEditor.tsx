import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "./TableEditor.css";

interface TableEditorProps {
  initialMarkdown?: string;
}

const TableEditor: React.FC<TableEditorProps> = ({
  initialMarkdown = `| Tables   |      Are      |  Cool |
|----------|:-------------:|------:|
| col 1 is |  left-aligned | $1600 |
| col 2 is |    centered   |   $12 |
| col 3 is | right-aligned |    $1 |`,
}) => {
  const [markdown, setMarkdown] = useState<string>(initialMarkdown);
  const [isPreview, setIsPreview] = useState<boolean>(true);

  const handleMarkdownChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMarkdown(e.target.value);
  };

  return (
    <div className="table-editor">
      <div className="editor-header">
        <h2>Table Editor</h2>
        <div className="toggle-buttons">
          <button className={!isPreview ? "active" : ""} onClick={() => setIsPreview(false)}>
            Edit
          </button>
          <button className={isPreview ? "active" : ""} onClick={() => setIsPreview(true)}>
            Preview
          </button>
        </div>
      </div>

      <div className="editor-content">
        {!isPreview ? (
          <textarea
            value={markdown}
            onChange={handleMarkdownChange}
            className="markdown-input"
            placeholder="Enter your markdown table here..."
            rows={15}
          />
        ) : (
          <div className="markdown-preview">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                table: ({ children, ...props }) => (
                  <table className="custom-table" {...props}>
                    {children}
                  </table>
                ),
                thead: ({ children, ...props }) => (
                  <thead className="custom-thead" {...props}>
                    {children}
                  </thead>
                ),
                tbody: ({ children, ...props }) => (
                  <tbody className="custom-tbody" {...props}>
                    {children}
                  </tbody>
                ),
                tr: ({ children, ...props }) => (
                  <tr className="custom-tr" {...props}>
                    {children}
                  </tr>
                ),
                th: ({ children, ...props }) => (
                  <th className="custom-th" {...props}>
                    {children}
                  </th>
                ),
                td: ({ children, ...props }) => (
                  <td className="custom-td" {...props}>
                    {children}
                  </td>
                ),
              }}
            >
              {markdown}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
};

export default TableEditor;
