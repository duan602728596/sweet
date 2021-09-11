import PropTypes from 'prop-types';
// import Markdown from 'react-markdown';
import MarkdownView from 'react-showdown';
import 'github-markdown-css/github-markdown.css';
// import gfm from 'remark-gfm';

function MarkDown(props) {
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