import AWS from './lib/aws';
import { CreateReview } from './CreateReview';

export const createReview = (req, res) => {
  new CreateReview(AWS, 'ReviewsTable')
  .handle(req.swagger.params.body.raw)
  .catch(res.json)
  .then(res.json)
  ;
};
