import { ServiceGateway } from '../../lib/ServiceGateway';

describe('ServiceGateway', () => {

  const client = {
    apisArray: [
      {
        name: 'first',
        operationsArray: [
          { nickname: 'x' },
          { nickname: 'y' },
        ],
      },
      {
        name: 'second',
        operationsArray: [
          { nickname: 'a' },
          { nickname: 'b' },
        ],
      },
    ],

    first: { x: true, y: true },
    second: { a: true, b: true },
  };

  describe('#bootstrapSwaggerMethods', () => {
    it('should have all expected keys', () => {
      const result = ServiceGateway.bootstrapSwaggerMethods(client, {});

      expect(result).to.have.all.keys('x', 'y', 'a', 'b');
    });
  });

  describe('#dispatch', () => {

    it('should dispatch on existing calls', () => {
      const service = new ServiceGateway({ apisArray: [] });
      const method = 'method';
      const args = [ 1, 2, 3 ];

      const stub = service.api[method] = sinon.stub().returns(Promise.resolve());

      const result = service.dispatch(method, ...args);

      expect(result).to.eventually.be.fulfilled.then(() => {
        expect(stub).to.be.calledWith(...args);
      });
    });

    it('should reject unknown calls', () => {
      const service = new ServiceGateway({ apisArray: [] });

      const result = service.dispatch('unknown');

      expect(result).to.eventually.be.rejected;
    });

  })

});
