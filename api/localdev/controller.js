import AWS from './lib/aws';
import { CreateReview } from './CreateReview';
import { GetReview } from './GetReview';

export const createReview = (req, res) => {
  new CreateReview(AWS, 'ReviewsTable')
  .handle(req.swagger.params.body.raw)
  .catch(res.json)
  .then(res.json)
  ;
};

export const getReview = (req, res) => {
  new GetReview(AWS, 'ReviewsTable')
  .handle({
    id: req.swagger.params.id.value,
  })
  .catch(res.json)
  .then(res.json)
  ;
};
