import { UrlFactory } from './UrlFactory';

export class Storage {

  constructor({ urls = new UrlFactory({}) }) {
    this.urls = urls;
  }

  createReview({ title = '', description = '', url = '', submitter = '' }) {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: this.urls.createReview(),
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          url: url.trim(),
          submitter: submitter.trim(),
        }),

        success: resolve,
        error: reject, // TODO wrap zepto params as error object
      });
    });
  }

  review(id) {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: this.urls.review(id),
        type: 'GET',

        success: resolve,
        error: reject, // TODO wrap zepto params as error object
      });
    });
  }
}
