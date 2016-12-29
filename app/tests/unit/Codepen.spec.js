import { CodepenOrigin, CodepenSource } from '../../lib/Codepen';
import Prism from '../../lib/Prism';

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

      it('should return three sources without only', () => {
        // Sources are css, html, and js, maybe with different preprocessors
        return full.sources.then(sources => {
          expect(sources.length).to.equal(3);
        });
      });

      it('should return one source with only', () => {
        return html.sources.then(sources => {
          expect(sources.length).to.equal(1);
        });
      });

    });

  });

  describe('CodepenSource', () => {

    describe('#filename', () => {

      it('should resolve to a filename with the correct extension', done => {
        const source = new CodepenSource('id', 'somebody', 'sass');

        source.filename.then(filename => {
          expect(filename).to.match(/\.sass$/);

          done();
        });
      });

    });

    describe('#language', () => {

      function expectLanguages(languages, expectation) {
        const languagePromises = languages
        .map(language => new CodepenSource('id', 'somebody', language))
        .map(source => source.language)
        ;

        return Promise
        .all(languagePromises)
        .then(languages => languages.forEach(expectation))
        ;
      }

      it('should resolve common languages as Prism languages', () => {
        const markup = [ 'html', 'haml', 'markdown', 'pug' ];
        const style = [ 'css', 'less', 'sass', 'scss', 'stylus' ];
        const script = [ 'js', 'coffeescript', 'livescript', 'typescript' ];
        const languages = markup.concat(style, script);

        return expectLanguages(languages, language => {
          const prism = Prism.languages[language];

          expect(prism).to.exist;
        });
      });

      it('should resolve overridden languages as Prism langauges', () => {
        return expectLanguages([ 'babel', 'sass', 'pug', 'slim' ], language => {
          const prism = Prism.languages[language];

          expect(prism).to.exist;
        });
      });

    });

    describe('#code', () => {
      let server;

      before(() => {
        server = sinon.fakeServer.create({
          autoRespond: true,
        });
      });

      after(() => {
        server.restore();
      });

      it('should return raw code', () => {
        const html = '<p>test</p>';

        server.respondWith('GET', 'https://codepen.io/somebody/pen/id.html',
          [ 200, { 'Content-Type': 'text/html' }, html ]);

        return new CodepenSource('id', 'somebody', 'html')
        .code
        .then(code => {
          expect(code).to.equal(html);
        })
        ;
      });

      it('should not try to run javascript', () => {
        const js = 'window.pass = false; console.warn("JavaScript executed");';

        window.pass = true;

        server.respondWith('GET', 'https://codepen.io/somebody/pen/id.js',
          [ 200, { 'Content-Type': 'text/javascript' }, js ]);

        return new CodepenSource('id', 'somebody', 'js')
        .code
        .then(code => {
          expect(code).to.equal(js);
          expect(window.pass).to.be.true;
        })
        .catch(err => {
          assert(false, 'JavaScript executed');
        })
        ;
      });

      it('should return cached code on subsequent calls', () => {
        const js = 'true;';
        const source = new CodepenSource('id', 'somebody', 'js');
        const spy = sinon.spy(source, '_ajax');

        server.respondWith('GET', 'https://codepen.io/somebody/pen/id.js',
          [ 200, { 'Content-Type': 'text/javascript' }, js ]);

        return source.code.then(original => {
          return source.code.then(cached => {
            expect(cached).to.equal(original);
            expect(spy).to.be.calledOnce;
          });
        });
      });

    });

  });

});

