import connect from 'connect';

import path from 'path';

import livereload from 'connect-livereload';
import minimist from 'minimist';
import serveStatic from 'serve-static';
import swagger from 'swagger-express-mw';

const ARGV = minimist(process.argv.slice(2), {
  default: {
    'server-port': 8000,
    'site-path': path.join('.', 'dist', 'site'),
    'api-path': path.join('.', 'dist', 'localdev'),
  },
});

const app = connect();

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
