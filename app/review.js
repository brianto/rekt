import { Storage } from './lib/Storage';

import qs from 'qs';

const UUID = /[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}/;

class CodeReview {

  constructor({
    title, description, submitter, timestamp,
    initialize = true, storage = new Storage({}),
  }) {
    this.title = title;
    this.description = description;
    this.submitter = submitter;
    this.timestamp = timestamp;

    this.storage = storage;

    this.query = {};

    if (initialize) {
      this._init();
    }
  }

  _init() {
    const [, rawQuery] = window.location.search.split('?');
    this.query = qs.parse(rawQuery);
    const { id } = this.query;

    if (!this.validReviewId(id)) {
      // TODO
    }

    this.loadReview(id);
  }

  validReviewId(id) {
    return id && !id.match(UUID).length;
  }

  loadReview(id) {
    return this.storage
    .review(id)
    .then(review => {
      this.renderMetadata(review);
      this.renderCode(review);
    });
  }

  renderMetadata(review) {
    this.title.text(review.title);
    this.description.text(review.description);
    this.submitter.text(review.submitter);

    // timestamp is String in localdev
    const timestamp = new Date(parseInt(review.timestamp, 10));
    this.timestamp.text(timestamp.toLocaleString());
  }

  renderCode(review) {
    // TODO
  }
}

$($ => {
  const container = $('.container');
  const review = new CodeReview({
    title: container.find('#title'),
    description: container.find('#description'),
    submitter: container.find('#submitter'),
    timestamp: container.find('#timestamp'),
  });
});