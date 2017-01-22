import AWS from './lib/aws';
import { CreateReview } from './CreateReview';

export const OnCreateReview = (req, res) => {
  new CreateReview(AWS, 'reviews')
  .handle(req.swagger.params.body.raw)
  .catch(res.json)
  .then(res.json)
  ;
};
