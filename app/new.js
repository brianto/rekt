import { CodepenOrigin } from './lib/Codepen';

const ORIGIN_FACTORIES = [
  CodepenOrigin,
];

function originFor(url) {
  const factory = ORIGIN_FACTORIES.find(f => f.handles(url));
  return new factory(url);
}

$($ => {
  // TODO for testing
  const files = $('#files');
  const filter = $('#filter');
  const preview = $('#preview');
  const render = $('#render');
  const review = $('#review');
  const source = $('#source');

  preview.on('click', e => {
    originFor(source.val())
    .sources
    .then(sources => Promise.resolve(sources[0]))
    .then(source => Promise.all([
        source.code, source.filename, source.language
    ]))
    .then(([ code, filename, language ]) => {
      render.find('code').text(code);
      files.append($(`<li><tt>${filename}</tt></li>`));
    })
    ;
  });
});
