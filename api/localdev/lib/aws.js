import AWS from 'aws-sdk';

AWS.config.setPromisesDependency(Promise);
AWS.config.update({
  // Keys unused, but required
  // Region doesn't matter, used only for naming
  // https://aws.amazon.com/blogs/aws/dynamodb-local-for-desktop-development/
  region: 'us-west-1',
  accessKeyId: 'rekt',
  secretAccessKey: 'rekt',
});

export default AWS;
