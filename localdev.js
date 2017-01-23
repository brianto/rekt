import connect from 'connect';

import DynamoDBFixture from './lib/DynamoDBFixture';

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
    'sample-code-path': path.join('.', 'api', 'localdev', 'sample-code'),
    'stack': path.join('.', 'stack.yml'),
  },
});

const app = connect();

const dynamodb = new DynamoDBFixture({
  port: ARGV['dynamodb-port'],
  stackFile: ARGV['stack'],
});

dynamodb.setup();

swagger.create({
  appRoot: ARGV['api-path'],
  swagger: path.join(ARGV['api-path'], 'swagger.yml'),
  configDir: '.',
}, (err, swagger) => {
  if (err) {
    throw err;
  }

  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
  });

  app.use(livereload());
  app.use(serveStatic(ARGV['site-path']));
  app.use(serveStatic(ARGV['sample-code-path']));

  swagger.register(app);

  app.listen(ARGV['server-port']);
});
