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

      Prism.highlightElement(code[0]);

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

  describe('#_wrap', () => {
    const html = '  code';
    const index = 9;

    let container;
    let numbering;
    let code;

    beforeEach(() => {
      container = plugin._wrap(html, index);
      numbering = container.find('.line-number');
      code = container.find('code');
    });

    describe('result container', () => {

      it('should have the correct classes', () => {
        expect(container.hasClass('line')).to.be.true;
      });

      it('should have line number data', () => {
        const line = container.data('line-number');
        expect(line).to.equal(index);
      });

      it('should have a line break as the last element', () => {
        const last = container.children().last();
        expect(last).to.satisfy(last => last.is('br'));
      });

    });

    describe('result line number', () => {

      it('should have the correct classes', () => {
        expect(numbering.hasClass('line-number')).to.be.true;
        expect(numbering.hasClass('token')).to.be.true;
        expect(numbering.hasClass('comment')).to.be.true;
      });

      it('should have the correct text', () => {
        expect(numbering.text()).to.equal(String(index + 1));
      });

    });

    describe('result code', () => {

      it('should display the markup, unchanged', () => {
        expect(code.html()).to.equal(html);
      });

    });

  });

});
