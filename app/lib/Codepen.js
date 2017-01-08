const URL_MATCH = /codepen\.io\/([^.]+)\/(?:[^\/]+)\/([^.\/]+)(?:.(.+))?\/*$/;
const ALL_TYPES = [ 'js', 'css', 'html' ];
const LANGUAGE_MAP = {
  babel: 'javascript',
  postcss: 'scss', // Close enough
  pug: 'jade', // https://github.com/pugjs/pug/issues/2184
  slim: 'jade', // Close enough
};

export class CodepenOrigin {
  static handles(url) {
    return !!url.match(URL_MATCH);
  }

  constructor(url) {
    [, this.username, this.id, this.only] = url.match(URL_MATCH);
  }

  get sources() {
    if (this._sources) {
      return Promise.resolve(this._sources);
    }

    const types = this.only ? [ this.only ] : ALL_TYPES;

    this._sources = types.map(type => new CodepenSource(this.id, this.username, type));
    return Promise.resolve(this._sources);
  }
}

export class CodepenSource {
  constructor(id, username, type) {
    this.id = id;
    this.username = username;
    this.type = type;
  }

  get filename() {
    return Promise.resolve(`codepen.${this.type}`);
  }

  get language() {
    return Promise.resolve(LANGUAGE_MAP[this.type] || this.type);
  }

  get code() {
    if (this._code) {
      return Promise.resolve(this._code);
    }

    return this._ajax()
    .then(code => {
      this._code = code;
      return Promise.resolve(this._code);
    })
    ;
  }

  _ajax() {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: `https://codepen.io/${this.username}/pen/${this.id}.${this.type}`,
        type: 'GET',

        // Codepen correctly sets the content type of the file. However, that's
        // not what we want here. If the content type happens to be
        // "text/javascript", then the browser will treat the response as
        // something that can be run and **will** run it.
        dataType: 'text/plain',

        success: resolve,
        error: (/* xhr, type, error */) => reject(Array.from(arguments)),
      });
    });
  }
}

