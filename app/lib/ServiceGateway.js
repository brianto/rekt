import SwaggerClient from 'swagger-js';

export class ServiceGateway {

  constructor(client) {
    this.api = {};

    if (client) {
      this._promise = Promise.resolve(client);
      ServiceGateway.bootstrapSwaggerMethods(client, this.api);
    } else {
      this._promise = new SwaggerClient({
        url: '/swagger.json',
        usePromise: true,
      })
      .then(client => {
        ServiceGateway.bootstrapSwaggerMethods(client, this.api);
      });
    }
  }

  dispatch(method, ...args) {
    return this._promise.then(() => {
      if (method in this.api) {
        return this.api[method](...args);
      }

      return Promise.reject(`No such method '${method}', only [${Object.keys(this.api)}] available`);
    });
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
