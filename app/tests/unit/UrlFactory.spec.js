import { UrlFactory } from '../../lib/UrlFactory';

describe('UrlFactory', () => {
  const BASE_URL = 'https://rekt.execute-api.cn-north-1.amazonaws.cn';

  const factory = new UrlFactory({ baseUrl: BASE_URL });

  describe('#createReview', () => {
    it('should look correct', () => {
      const url = factory.createReview();
      expect(url).to.include(BASE_URL);
      expect(url).to.include('reviews');
    });
  });

  describe('#review', () => {
    it('should look correct', () => {
      const id = '1234';
      const url = factory.review(id);
      expect(url).to.include(BASE_URL);
      expect(url).to.include(id);
      expect(url).to.include('reviews');
    });
  });

  describe('#createComment', () => {
    it('should look correct', () => {
      const id = '1234';
      const url = factory.createComment(id);
      expect(url).to.include(BASE_URL);
      expect(url).to.include(id);
      expect(url).to.include('reviews');
      expect(url).to.include('comment');
    });
  });

  describe('#comments', () => {
    it('should look correct', () => {
      const id = '1234';
      const url = factory.comments(id);
      expect(url).to.include(BASE_URL);
      expect(url).to.include(id);
      expect(url).to.include('reviews');
      expect(url).to.include('comment');
    });
  });

});

