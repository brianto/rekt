import AWS from 'aws-sdk';
import uuid from 'uuid';

export class CreateReview {

  constructor(AWS, table) {
    this.client = new AWS.DynamoDB.DocumentClient({
      params: {
        TableName: table,
      },
    });
  }

  itemFrom(params) {
    return {
      id: uuid.v4(),
      timestamp: new Date().getTime(),

      title: params.title,
      description: params.description,
      url: params.url,
      submitter: params.submitter,
    };
  }

  handle(params) {
    const item = this.itemFrom(params);

    return this.client.put({
      Item: item,
    })
    .promise()
    .then(() => item)
    ;
  }

  static handler(event, context, callback) {
    AWS.config.update({
      region: process.env.AWS_REGION,
    });

    new CreateReview(AWS, process.env.REKT_REVIEWS_TABLE)
    .handle(event)
    .then(item => callback(null, item))
    .catch(err => callback(err))
    ;
  }
}

export const handler = CreateReview.handler;
