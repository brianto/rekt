export class AnnotationPlugin {

  constructor({
    onSelection = $.noop,
  }) {
    this.onSelection = onSelection;

  }

  transform(env) {
    if (!env.code) {
      return;
    }

    const code = $(env.element);
  }

  install(Prism) {
    Prism.hooks.add('after-highlight', env => this.transform(env));
  }

}
