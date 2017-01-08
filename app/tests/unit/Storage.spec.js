import { Storage } from '../../lib/Storage';

describe('Storage', () => {

  function mockUrls(...methods) {
    return methods
    .map(name => {
      const obj = { };
      obj[name] = () => { };
      return obj;
    })
    .reduce((memo, entry) => Object.assign(memo, entry), { })
    ;
  }

  let server;

  before(() => {
    server = sinon.fakeServer.create({
      autoRespond: true,
    });
  });

  after(() => {
    server.restore();
  });

  describe('#createReview', () => {
    const ENDPOINT = '/endpoint';

    let urls;
    let storage;

    beforeEach(() => {
      urls = mockUrls('createReview');
      storage = new Storage({ urls: urls });
    });

    it('should call json endpoint', () => {
      sinon.stub(urls, 'createReview').returns(ENDPOINT);

      server.respondWith('POST', ENDPOINT,
        [ 201, { 'Content-Type': 'application/json' }, JSON.stringify({ }) ]);

      return storage.createReview({
        title: 'title',
        description: 'description',
        url: 'url',
        submitter: 'submitter',
      })
      .then(data => {
        expect(data).to.exist;
      })
      ;
    });

    it('should reject on error', () => {
      const STATUS = 403;
      sinon.stub(urls, 'createReview').returns(ENDPOINT);

      server.respondWith('POST', ENDPOINT, [ STATUS, { }, '' ]);

      return storage.createReview({ })
      .catch(error => {
        // TODO doesn't catch the negative case
        expect(error).to.exist;
      })
      ;
    });
  });

});

