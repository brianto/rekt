import marked from '../../lib/Marked';

import Prism from '../../lib/Prism';

describe('Marked', () => {

  it('should highlight markup', () => {
    const spy = sinon.spy(Prism, 'highlight');

    const source = `
\`\`\`javascript
(function(){})();
\`\`\`
    `.trim();

    const html = marked(source);

    expect($(html).length).to.be.ok;
    expect(html).to.include('function');
    expect(spy).to.be.calledOnce;
  });

});
