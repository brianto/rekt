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
  }

  install(Prism) {
    Prism.hooks.add('before-highlight', env => this.prepare(env));
    Prism.hooks.add('after-highlight', env => this.transform(env));
  }

}
