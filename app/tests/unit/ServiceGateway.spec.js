import { ServiceGateway } from '../../lib/ServiceGateway';

describe('ServiceGateway', () => {

  describe('#bootstrapSwaggerMethods', () => {
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

    const result = ServiceGateway.bootstrapSwaggerMethods(client, {});

    expect(result).to.have.all.keys('x', 'y', 'a', 'b');
  });

});
