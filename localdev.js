import connect from 'connect';

import path from 'path';

import livereload from 'connect-livereload';
import minimist from 'minimist';
import serveStatic from 'serve-static';

const ARGV = minimist(process.argv.slice(2), {
  default: {
    'server-port': 8000,
    'site-path': path.join('.', 'dist', 'site'),
  },
});

const app = connect();

app.use(livereload());
app.use(serveStatic(ARGV['site-path']));

app.listen(ARGV['server-port']);

