import { AnnotationPlugin } from '../../../lib/prism/AnnotationPlugin';

import Prism from '../../../lib/Prism';

describe('AnnotationPlugin', () => {
  const SOURCE = `
class Derp:
  """It's derp!"""
  pass
  `.trim();

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

    code.text(SOURCE);

  });

  describe('#install', () => {

    it('had its hooks called', () => {
      const prepare = sinon.spy(plugin, 'prepare');
      const transform = sinon.spy(plugin, 'transform');

      Prism.highlightElement(pre[0]);

      expect(prepare).to.be.calledOnce;
      expect(transform).to.be.calledOnce;
    });

  });

  describe('#prepare', () => {

    it('should save the original source lines', () => {
      plugin.prepare({
        code: SOURCE,
      });

      expect(plugin.lines).to.be.an('array');
      expect(plugin.lines.join('\n')).to.equal(SOURCE);
    });

    it('should have no lines when source is missing', () => {
      plugin.prepare({
        code: undefined,
      });

      expect(plugin.lines).to.be.an('array');
      expect(plugin.lines).to.be.empty;
    });

  });

});
