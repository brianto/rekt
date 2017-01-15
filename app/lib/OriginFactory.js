import { CodepenOrigin } from './Codepen';
import { LocalhostOrigin } from './Localhost.js';

export class OriginFactory {

  constructor(factories = [
    CodepenOrigin,
    LocalhostOrigin,
  ]) {
    this.factories = factories;
  }

  originFor(url) {
    const factory = this.factories.find(f => f.handles(url));

    if (!factory) {
      throw new Error(`Unsupported source '${url}'`);
    }

    return new factory(url);
  }
}
