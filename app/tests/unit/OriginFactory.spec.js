import { OriginFactory } from '../../lib/OriginFactory';

describe('OriginFactory', () => {

  it('should use conformant origins', () => {
    const factory = new OriginFactory();

    for (let constructor of factory.factories) {
      expect(constructor).itself.to.respondTo('handles');
    }
  });

  describe('#originFor', () => {
    it('should return the origin that can handle the provided url', () => {
      const origin = sinon.spy();
      origin.handles = () => true;

      const url = 'some url';
      const factory = new OriginFactory([ origin ]);
      const result = factory.originFor(url);

      expect(origin).to.be.calledWith(url);
    });

    it('should throw an error when no origin can handle the provided url', () => {
      const factory = new OriginFactory([]);
      expect(() => {
        factory.originFor('some url');
      }).to.throw(/Unsupported source/i);
    });
  });
});
