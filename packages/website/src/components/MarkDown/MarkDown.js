import PropTypes from 'prop-types';
import Markdown from 'react-markdown';
import 'github-markdown-css/github-markdown.css';
import gfm from 'remark-gfm';

function MarkDown(props) {
  return (
    <div className="markdown-body">
      <Markdown plugins={ [gfm] }>
        { props.markdown }
      </Markdown>
    </div>
  );
}


MarkDown.propTypes = {
  markdown: PropTypes.string
};

export default MarkDown;