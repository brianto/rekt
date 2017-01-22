import AWS from 'aws-sdk';

AWS.config.setPromisesDependency(Promise);

export default AWS;
