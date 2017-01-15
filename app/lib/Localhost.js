const URL_MATCH = /\/\/localhost:\d+\/([a-z]+)\/([a-zA-Z0-9$-_.]+)$/;

export class LocalhostOrigin {
  static handles(url) {
    return !!url.match(URL_MATCH);
  }

  constructor(url) {
    this.url = url;
    [, this.language, this.filename] = url.match(URL_MATCH);
  }

  get sources() {
    const source = new LocalhostSource(this.url, this.language, this.filename);
    return Promise.resolve([ source ]);
  }
}

export class LocalhostSource {
  constructor(url, language, filename) {
    this.url = url;
    this._language = language;
    this._filename = filename;
  }

  get filename() {
    return Promise.resolve(this._filename);
  }

  get language() {
    return Promise.resolve(this._language);
  }

  get code() {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: this.url,
        type: 'GET',
        dataType: 'text/plain',
        success: resolve,
        error: (/* xhr, type, error */) => reject(Array.from(arguments)),
      });
    });
  }

}

