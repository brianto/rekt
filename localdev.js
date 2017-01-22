import connect from 'connect';

import DynamoDBFixture from './lib/dynamodb';

import path from 'path';

import livereload from 'connect-livereload';
import minimist from 'minimist';
import serveStatic from 'serve-static';
import swagger from 'swagger-express-mw';

const ARGV = minimist(process.argv.slice(2), {
  default: {
    'server-port': 8000,
    'dynamodb-port': 4567,
    'site-path': path.join('.', 'dist', 'site'),
    'api-path': path.join('.', 'dist', 'localdev'),
    'stack': path.join('.', 'stack.yml'),
  },
});

const app = connect();

const dynamodb = new DynamoDBFixture({
  port: ARGV['dynamodb-port'],
  stackFile: ARGV['stack'],
});

swagger.create({
  appRoot: ARGV['api-path'],
  swagger: path.join(ARGV['api-path'], 'swagger.yml'),
  configDir: '.',
}, (err, swagger) => {
  if (err) {
    throw err;
  }

  app.use(livereload());
  app.use(serveStatic(ARGV['site-path']));

  swagger.register(app);

  app.listen(ARGV['server-port']);
});
