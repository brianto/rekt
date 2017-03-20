import { ServiceGateway } from './lib/ServiceGateway';
import { OriginFactory } from './lib/OriginFactory';
import { SourceReviewer } from './lib/views/Source';

import qs from 'qs';

const UUID = /[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}/;

class CodeReview {

  constructor({
    title, description, submitter, timestamp, sources,
    initialize = true, service = new ServiceGateway(), origins = new OriginFactory(),
  }) {
    this.title = title;
    this.description = description;
    this.submitter = submitter;
    this.timestamp = timestamp;
    this.sources = sources;

    this.service = service;
    this.origins = origins;

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
    return this.service
    .dispatch('getReview', { id: id })
    .then(({ obj: review }) => {
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
    const origin = this.origins.originFor(review.url);
    origin.sources.then(sources => sources.forEach(s => this.renderSource(s)));
  }

  renderSource(source) {
    const reviewer = new SourceReviewer(source, this.sources);
  }
}

$($ => {
  const container = $('.container');
  const review = new CodeReview({
    title: container.find('#title'),
    description: container.find('#description'),
    submitter: container.find('#submitter'),
    timestamp: container.find('#timestamp'),
    sources: container.find('#sources'),
  });
});
