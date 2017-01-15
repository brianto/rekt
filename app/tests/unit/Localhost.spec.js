import { LocalhostOrigin, LocalhostSource } from '../../lib/Localhost';

describe('Localhost', () => {
  describe('LocalhostOrigin', () => {

    describe('#handles', () => {
      it('should match localhost-like urls', () => {
        const result = LocalhostOrigin.handles('https://localhost:1234/st/um.py');
        expect(result).to.be.true;
      });
    });

    describe('#constructor', () => {
      it('should parse fields from url correctly', () => {
        const url = 'https://localhost:1234/lang/file.txt';
        const origin = new LocalhostOrigin(url);

        expect(origin.url).to.equal(url);
        expect(origin.language).to.equal('lang');
        expect(origin.filename).to.equal('file.txt');
      });
    });

    describe('#sources', () => {
      const origin = new LocalhostOrigin('https://localhost:1234/st/um.py');

      it('should return a promise with one file', () => {
        expect(origin.sources).to.be.instanceof(Promise);
        return origin.sources.then(sources => {
          expect(sources.length).to.equal(1);
        });
      });
    });

  });

  describe('LocalhostSource', () => {
    const source = new LocalhostSource('https://localhost:1234/st/um.py', 'st', 'um.py');

    describe('#filename', () => {
      it('should be the same as the input', () => {
        return source.filename.then(filename => {
          expect(filename).to.equal('um.py');
        });
      });
    });

    describe('#language', () => {
      it('should be the same as the input', () => {
        return source.language.then(language => {
          expect(language).to.equal('st');
        });
      });
    });

    describe('#code', () => {
      const url = 'https://localhost:1234/st/um.py';
      const source = new LocalhostSource(url, 'st', 'um.py');

      const payload = 'print("hello")';

      let server;

      before(() => {
        server = sinon.fakeServer.create({
          autoRespond: true,
        });

        server.respondWith('GET', url,
          [ 200, { 'Content-Type': 'text/plain' }, payload ]);
      });

      after(() => {
        server.restore();
      });

      it('should make an ajax request', () => {
        return source.code.then(code => {
          expect(code).to.equal(payload);
        });
      });
    });
  });
});
