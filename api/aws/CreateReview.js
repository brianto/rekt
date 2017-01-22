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
    console.log(params);
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
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });

    new CreateReview(AWS, process.env.REKT_REVIEWS_TABLE)
    .handle(params)
    .then(item => callback(null, item))
    .catch(err => callback(err))
    ;
  }
}

export const handler = CreateReview.handler;
