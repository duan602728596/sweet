import type { ReactElement } from 'react';
import PropTypes from 'prop-types';
import MarkdownView from 'react-showdown';
import 'github-markdown-css/github-markdown.css';

interface MarkDownProps {
  markdown: string;
}

/* 渲染markdown */
function MarkDown(props: MarkDownProps): ReactElement {
  return (
    <div className="markdown-body">
      <MarkdownView markdown={ props.markdown } options={{ tables: true, emoji: true }} />
    </div>
  );
}


MarkDown.propTypes = {
  markdown: PropTypes.string
};

export default MarkDown;