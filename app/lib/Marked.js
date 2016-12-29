import Prism from './Prism';
import marked from 'marked';

marked.options({
  highlight: (code, language) => Prism.highlight(code, Prism.languages[language]),
});

export default marked;

