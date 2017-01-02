import { AnnotationPlugin } from '../../../lib/prism/AnnotationPlugin';

import Prism from '../../../lib/Prism';

describe('AnnotationPlugin', () => {
  let plugin;
  let pre;
  let code;

  before(() => {
    plugin = new AnnotationPlugin({ });

    plugin.install(Prism);
  });

  beforeEach(() => {
    const fixture = $('<pre class="language-python"><code></code></pre>');
    $(document.body).append(fixture);

    pre = $('pre.language-python');
    code = pre.find('code');

    const source = `
class Derp:
  """It's derp!"""
  pass
    `.trim();
    code.text(source);

  });

  it('had its hooks called', () => {
    const spy = sinon.spy(plugin, 'transform');

    Prism.highlightElement(pre[0]);

    expect(spy).to.be.calledOnce;
  });
});
