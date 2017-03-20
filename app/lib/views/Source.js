import HTML_SOURCE_EXPANDER from './source-expander.html';
import HTML_SOURCE_VIEWER from './source-viewer.html';

import Prism from '../Prism';

export const EXPANDED_CLASS = 'fa-plus-square';
export const COLLAPSED_CLASS = 'fa-minus-square-o';

export class SourceExpander {

  constructor(source, element = $(HTML_SOURCE_EXPANDER), init = true) {
    this.source = source;
    this.element = element;

    this.expanded = false;

    this.view = {
      expander: element.find('.id-expander'),
      status: element.find('.id-status'),
      filename: element.find('.id-filename'),
      content: element.find('.id-content'),
    };

    if (init) {
      this.initialize();
    }
  }

  set content(element) {
    this.view.content.html(element);
  }

  initialize() {
    this.expand(this.expanded);

    this.view.expander.on('click', this.onClickExpander.bind(this));

    this.source.filename.then(filename => {
      this.view.filename.text(filename);
    });
  }

  expand(expanded) {
    this.expanded = expanded;
    this.view.status.addClass(this.expanded ? COLLAPSED_CLASS : EXPANDED_CLASS);
    this.view.status.removeClass(this.expanded ? EXPANDED_CLASS : COLLAPSED_CLASS);
    this.view.content.toggle(this.expanded);

    if (typeof this.onLoad === 'function') {
      this.onLoad(this);
      this.onLoad = undefined;
    }
  }

  onClickExpander() {
    this.expand(!this.expanded);
  }
}

export class SourceViewer {

  constructor(source, element = $(HTML_SOURCE_VIEWER)) {
    this.source = source;
    this.element = element;

    this.view = {
      pre: this.element.find('pre'),
      code: this.element.find('code'),
    };
  }

  load() {
    return Promise.all([ this.source.language, this.source.code ])
    .then(([ language, code ]) => {
      this.view.code.addClass(`language-${language}`);
      this.view.code.text(code);

      this._highlight();
    });
  }

  _highlight() {
    Prism.highlightElement(this.view.code.get(0), false);
  }
}

export class SourceReviewer {

  constructor(source, parent,
    expander = new SourceExpander(source),
    viewer = new SourceViewer(source),
  ) {
    parent.append(expander.element);

    expander.content = viewer.element;
    expander.onLoad = viewer.load.bind(viewer);
  }
}
