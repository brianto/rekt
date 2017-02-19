import AWS from 'aws-sdk';

export class GetReview {

  constructor(AWS, table) {
    this.client = new AWS.DynamoDB.DocumentClient({
      params: {
        TableName: table,
      },
    });
  }

  handle({ id }) {
    return this.client.get({
      Key: { id: id },
    })
    .promise()
    .then(response => response.Item)
    ;
  }

  static handler(event, context, callback) {
    AWS.config.update({
      region: process.env.AWS_REGION,
    });

    new GetReview(AWS, process.env.REKT_REVIEWS_TABLE)
    .handle({ id: event.id })
    .then(item => callback(null, item))
    .catch(err => callback(err))
    ;
  }
}

export const handler = GetReview.handler;
