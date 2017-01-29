import SwaggerClient from 'swagger-js';

export class ServiceGateway {

  constructor(client) {
    if (client) {
      this.client = client;
    } else {
      new SwaggerClient({
        url: '/swagger.json',
        usePromise: true,
      })
      .then(client => {
        this.client = client;
        ServiceGateway.bootstrapSwaggerMethods(client, this);
      });
    }
  }

  static bootstrapSwaggerMethods(client, target) {
    for (let api of client.apisArray) {
      const tag = api.name;

      for (let operation of api.operationsArray) {
        const method = operation.nickname;

        target[method] = client[tag][method];
      }
    }

    return target;
  }
}
