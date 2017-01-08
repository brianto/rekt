import config from './config';

export class UrlFactory {

  constructor({ baseUrl = config.baseUrl }) {
    this.baseUrl = baseUrl;
  }

  createReview() {
    return `${this.baseUrl}/reviews`;
  }

  review(id) {
    return `${this.baseUrl}/reviews/${id}`;
  }

  createComment(id) {
    return `${this.baseUrl}/reviews/${id}/comment`;
  }

  comments(id) {
    return `${this.baseUrl}/reviews/${id}/comment`;
  }

}

