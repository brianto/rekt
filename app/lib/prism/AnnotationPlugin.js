export class AnnotationPlugin {

  constructor({
    onSelection = $.noop,
  }) {
    this.onSelection = onSelection;

  }

  prepare(env) {
    this.lines = env.code ? env.code.split('\n') : [];
  }

  transform(env) {
    if (!env.code) {
      return;
    }

    const code = $(env.element);
    const pre = code.parent();

    const markup = code.html().split('\n');
    const wrappers = markup.map(this._wrap.bind(this));

    pre.empty();
    for (let wrapper of wrappers) {
      pre.append(wrapper);
    }
  }

  _wrap(markup, index) {
    const wrapper = $('<span></span>').addClass('line').data('line-number', index);

    const numbering = $('<span></span>')
    .addClass('line-number')
    .addClass('token')
    .addClass('comment')
    .text(index + 1)
    ;
    wrapper.append(numbering);

    const code = $('<code></code>').html(markup);
    wrapper.append(code);

    const newline = $('<br />');
    wrapper.append(newline);

    return wrapper;
  }

  install(Prism) {
    Prism.hooks.add('before-highlight', env => this.prepare(env));
    Prism.hooks.add('after-highlight', env => this.transform(env));
  }

}
