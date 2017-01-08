var express = require('express');
var parser = require('body-parser');
var AWS = require('aws-sdk');
var uuid = require('uuid');

// Express Config
var app = express();
app.use(parser.json());
app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// AWS Config
AWS.config.setPromisesDependency(Promise);
var dynamodb = new AWS.DynamoDB({
  endpoint: 'http://localhost:4567',

  // Keys unused, but required
  // Region doesn't matter, used only for naming
  // https://aws.amazon.com/blogs/aws/dynamodb-local-for-desktop-development/
  region: 'us-west-1',
  accessKeyId: 'rekt',
  secretAccessKey: 'rekt',
});

// Errors
function awsError(error) {
  throw new Error(error);
}

function awsTap(callback) {
  return function(data) {
    console.log(callback(data));
    return Promise.resolve(data);
  };
}

// Table Setup
function updateReview(data) {
  return function() {
    return dynamodb.updateItem({
      TableName: 'reviews',

      ConditionExpression: 'attribute_not_exists(id)',
      ReturnValues: 'ALL_NEW',

      UpdateExpression: 'SET #t = :t, #d = :d, #u = :u, #s = :s, #z = :z',
      ExpressionAttributeNames: {
        '#t': 'title',
        '#d': 'description',
        '#u': 'url',
        '#s': 'submitter',
        '#z': 'timestamp',
      },

      Key: {
        id: { S: uuid.v4() },
      },

      ExpressionAttributeValues: {
        ':t': { S: data.title },
        ':d': { S: data.description },
        ':u': { S: data.url },
        ':s': { S: data.submitter },
        ':z': { N: new Date().getTime().toString() },
      },
    })
    .promise()
    .catch(awsError)
    .then(awsTap(function(data) {
      return `Created Review: ${data.Attributes.id.S}`;
    }))
    ;
  };
}

dynamodb.createTable({
  TableName: 'reviews',

  KeySchema: [
    { AttributeName: 'id', KeyType: 'HASH' },
  ],

  AttributeDefinitions: [
    { AttributeName: 'id', AttributeType: 'S' },
  ],

  // Ignored
  ProvisionedThroughput: { ReadCapacityUnits: 1, WriteCapacityUnits: 1, },
}).promise()
.then(awsTap(function(data) {
  return `Created Table: ${data.TableDescription.TableName}`;
}))
.then(updateReview({
  title: 'Python Turle',
  description: 'CS1 Assignment',
  url: 'http://localhost:2020/turtle.py',
  submitter: 'freshman',
}))
.then(updateReview({
  title: 'Pizza Delivery System',
  description: 'SE 361',
  url: 'http://localhost:2020/pds.git',
  submitter: 'sophomore',
}))
.catch(awsError)
;

// Routes
app.post('/reviews', function(req, res) {
  console.log(req.body);
  updateReview({
    title: req.body.title,
    description: req.body.description,
    url: req.body.url,
    submitter: req.body.submitter,
  })()
  .catch(function(err) {
    res.send(err.message);
    awsError(err);
  })
  .then(function(data) {
    var obj = {};
    for (var key in data.Attributes) {
      var av = data.Attributes[key];
      obj[key] = av.S || av.N || av.B;
    }
    res.send(obj);
  });
});

app.get('/reviews/:id', function(req, res) {
  dynamodb
  .getItem({
    TableName: 'reviews',

    Key: {
      id: { S: req.params.id },
    }
  })
  .promise()
  .catch(function(err) {
    res.send(err.message);
    awsError(err);
  })
  .then(function(data) {
    var obj = {};
    for (var key in data.Item) {
      var av = data.Item[key];
      obj[key] = av.S || av.N || av.B;
    }
    res.send(obj);
  })
  ;
});

// Serve
var port = 7000;
app.listen(port, function() {
  console.log(`localdev serving on port ${port}`);
});

