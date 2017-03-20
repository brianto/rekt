import HTML_SOURCE_EXPANDER from '../../../lib/views/source-expander.html';
import HTML_SOURCE_VIEWER from '../../../lib/views/source-viewer.html';

import {
  SourceExpander,
  SourceViewer,
  EXPANDED_CLASS,
  COLLAPSED_CLASS,
} from '../../../lib/views/Source';

describe('Source', () => {

  describe('SourceExpander', () => {

    let expander;

    beforeEach(() => {
      expander = new SourceExpander({ }, $(HTML_SOURCE_EXPANDER), false);
    });

    describe('#new', () => {

      it('should not be expanded by default', () => {
        expect(expander.expanded).to.equal(false);
      });

      it('should have existing views', () => {
        expect(expander.view).to.exist;

        for (let field of Object.keys(expander.view)) {
          expect(expander.view[field]).to.exist.and.not.be.empty;
        }
      });

    });

    describe('#expand', () => {

      it('should have the collapsed icon after expanded', () => {
        expander.expand(true);

        // TODO Migrate to jquery, no karma helper for zepto via chai
        expect(expander.view.status.hasClass(EXPANDED_CLASS)).to.equal(false);
        expect(expander.view.status.hasClass(COLLAPSED_CLASS)).to.equal(true);
      });

      it('should have the expanded icon after collapsed', () => {
        expander.expand(false);

        expect(expander.view.status.hasClass(EXPANDED_CLASS)).to.equal(true);
        expect(expander.view.status.hasClass(COLLAPSED_CLASS)).to.equal(false);
      });

      it('should call onLoad on first call, only', () => {
        const onLoad = expander.onLoad = sinon.spy();

        expander.expand(true);
        expander.expand(false);

        expect(onLoad).to.be.calledOnce;
      });

    });

  });

  describe('SourceViewer', () => {

    let viewer;
    let source;

    beforeEach(() => {
      source = { };

      viewer = new SourceViewer(source, $(HTML_SOURCE_VIEWER));
    });

    describe('#new', () => {

      it('should have existing views', () => {
        expect(viewer.view).to.exist;
        expect(viewer.view).to.have.property('pre');
        expect(viewer.view).to.have.property('code');
      });

    });

    describe('#load', () => {

      it('should highlight the code element', () => {
        const highlight = viewer._highlight = sinon.spy();

        source.language = Promise.resolve('language');
        source.code = Promise.resolve('code');

        return viewer.load().then(() => {
          expect(highlight).to.be.called;
        });
      });

    });

  });

  describe('SourceReviewer', () => {

  });

});
