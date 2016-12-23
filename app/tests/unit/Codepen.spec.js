import { CodepenOrigin, CodepenSource } from '../../lib/Codepen';

describe('Codepen', () => {

  describe('CodepenOrigin', () => {

    describe('#handles', () => {

      it('should match copied links', () => {
        const url = 'https://codepen.io/somebody/pen/codepen-id';
        const result = CodepenOrigin.handles(url);

        expect(result).to.be.true;
      });

      it('should match direct resource links', () => {
        const base = 'https://codepen.io/somebody/pen/codepen-id';

        for (let ext of [ 'html', 'css', 'js', 'jade', 'less', 'babel' ]) {
          const url = `${base}.${ext}`;
          const result = CodepenOrigin.handles(url);

          expect(result).to.be.true;
        }
      });

      it('should match link for any view', () => {
        for (let view of [ 'details', 'full', 'debug', 'live', 'professor', 'pres' ]) {
          const url = `https://codepen.io/somebody/${view}/codepen-id`;
          const result = CodepenOrigin.handles(url);

          expect(result).to.be.true;
        }
      });
    });

    describe('#constructor', () => {

      it('should parse fields from url correctly', () => {
        const username = 'somebody';
        const id = 'codepen-id';
        const urls = [
          `https://codepen.io/${username}/pen/${id}`,
          `https://codepen.io/${username}/pen/${id}/`,
          `https://codepen.io/${username}/full/${id}`,
        ];

        for (let url of urls) {
          const origin = new CodepenOrigin(url);

          expect(origin.username).to.equal(username);
          expect(origin.id).to.equal(id);

          expect(origin.only).to.not.be.defined;
        }
      });

      it('should set only extension correctly', () => {
        const url = 'https://codepen.io/somebody/pen/codepen-id.html';
        const origin = new CodepenOrigin(url);

        expect(origin.only).to.equal('html');
      });

    });

    describe('#sources', () => {
      const full = new CodepenOrigin('https://codepen.io/somebody/pen/codepen-id');
      const html = new CodepenOrigin('https://codepen.io/somebody/pen/codepen-id.html');

      it('should return a promise', () => {
        expect(full.sources).to.be.instanceof(Promise);
      });

      it('should return three sources without only', done => {
        // Sources are css, html, and js, maybe with different preprocessors
        full.sources.then(sources => {
          expect(sources.length).to.equal(3);
          done();
        });
      });

      it('should return one source with only', done => {
        html.sources.then(sources => {
          expect(sources.length).to.equal(1);
          done();
        });
      });

    });

  });

  describe('CodepenSource', () => {
    // TODO
  });

});

