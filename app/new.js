import { CodepenOrigin } from './lib/Codepen';
import { Storage } from './lib/Storage';

import Prism from './lib/Prism';

const ORIGIN_FACTORIES = [
  CodepenOrigin,
];

function originFor(url) {
  const factory = ORIGIN_FACTORIES.find(f => f.handles(url));
  return new factory(url);
}

class FormPreview {

  constructor({
    container, description, files, render, preview, source, submit, submitter, title,
    initialize = true, storage = new Storage({}),
  }) {
    this.container = container;
    this.description = description;
    this.files = files;
    this.render = render;
    this.preview = preview;
    this.source = source;
    this.submit = submit;
    this.submitter = submitter;
    this.title = title;

    this.storage = storage;

    if (initialize) {
      this._init();
    }
  }

  _init() {
    this.container.hide();

    this.preview.addClass('button-primary');
    this.preview.on('click', this.onPreview.bind(this));

    this.submit.hide();
    this.submit.on('click', this.onSubmit.bind(this));

    this.source.on('input', this.onSource.bind(this));
    this.source.on('keypress', this.onKeypress.bind(this));
  }

  onKeypress(event) {
    if (event.key === 'Enter' || event.keyCode === 13) {
      this.preview.click();
    }
  }

  onSource(event) {
    this.preview.addClass('button-primary');
    this.container.hide();
    this.submit.hide();
  }

  onPreview(event) {
    const url = this.source.val();
    const origin = originFor(url);

    this.container.show();
    this.submit.show();
    this.files.children().remove();
    this.preview.removeClass('button-primary');

    origin.sources
    .then(sources => Promise.resolve(sources.map(this.useSource.bind(this))))
    .then(promises => this.renderInitialSource.call(this, promises))
    ;
  }

  onSubmit(event) {
    return this.storage.createReview({
      title: this.title.val(),
      description: this.description.val(),
      url: this.source.val(),
      submitter: this.submitter.val(),
    })
    .then(response => this.onReviewCreated(response))
    .catch((xhr, type, error) => this.onReviewFail(xhr, type, error))
    ;
  }

  onReviewCreated(response) {
    // TODO
  }

  onReviewFail(xhr, type, error) {
    // TODO
  }

  useSource(source) {
    return Promise
    .all([ source.filename, source.language ])
    .then(([ filename, language ]) => {
      const link = $(`<li><a href="#/"><tt>${filename}</tt></a></li>`);

      link.on('click', event => {
        this.files.children().removeClass('selected');
        link.addClass('selected');

        this.renderSource(source);
      });

      this.files.append(link);

      return Promise.resolve(link);
    });
  }

  renderInitialSource(sources) {
    if (!sources.length) {
      return;
    }

    sources[0].then(link => {
      link.click();
    });
  }

  renderSource(source) {
    Promise.all([ source.language, source.code ])
    .then(([ language, code ]) => {
      const definition = Prism.languages[language];
      const highlighted = definition ? Prism.highlight(code, definition) : code;

      this.render.html(highlighted);
    })
    .catch(err => {
      console.log(err);
    })
    ;
  }
}

$($ => {
  const preview = new FormPreview({
    container: $('#review'),
    description: $('#description'),
    files: $('#files'),
    render: $('#render'),
    preview: $('#preview'),
    source:$ ('#source'),
    submit:$ ('#submit'),
    submitter:$ ('#submitter'),
    title:$ ('#title'),
  });
});
