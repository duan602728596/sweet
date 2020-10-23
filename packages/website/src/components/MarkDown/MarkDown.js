import ReactShowdown from 'react-showdown';
import 'github-markdown-css/github-markdown.css';

function MarkDown(props) {
  return (
    <div className="markdown-body">
      <ReactShowdown options={{ openLinksInNewWindow: true, disableForced4SpacesIndentedSublists: true }} { ...props } />
    </div>
  );
}

export default MarkDown;