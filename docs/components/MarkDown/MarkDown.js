import React from 'react';
import ReactMarkdown from 'react-markdown';
import 'github-markdown-css/github-markdown.css';

function MarkDown(props) {
  return (
    <div className="markdown-body" style={{ padding: '16px' }}>
      <ReactMarkdown { ...props } />
    </div>
  );
}

export default MarkDown;