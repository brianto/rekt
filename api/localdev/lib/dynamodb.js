import AWS from './aws';

import dynamodb from 'dynamodb-local';
import yaml from 'js-yaml';
import promisify from 'promisify-node';
import { CLOUDFORMATION_SCHEMA } from 'cloudformation-js-yaml-schema';

const fs = promisify('fs');

export default class DynamoDBFixture {

  constructor({
    port, stackFile, localDbArgs = [ '-sharedDb' ],
  }) {
    this.port = port;

    const stack = yaml.load(fs.readFileSync(stackFile, 'utf8'), {
      schema: CLOUDFORMATION_SCHEMA,
      skipInvalid: true,
    });

    dynamodb.launch(port, null, localDbArgs)
    .then(() => this.setup(stack))
    .catch(err => { throw new Error(err); })
    ;
  }

  setup(stack) {
    this.client = new AWS.DynamoDB({
      endpoint: `http://localhost:${this.port}`,

      // Keys unused, but required
      // Region doesn't matter, used only for naming
      // https://aws.amazon.com/blogs/aws/dynamodb-local-for-desktop-development/
      region: 'us-west-1',
      accessKeyId: 'rekt',
      secretAccessKey: 'rekt',
    });

    const tableDefinitions = this.findTableDefinitions(stack);

    this.createTables(tableDefinitions).then(tables => {
      tables.forEach(table => {
        console.log(`Created Table: ${table.TableDescription.TableName}`);
      });
    })
    ;
  }

  findTableDefinitions(stack) {
    const resources = stack.Resources;
    const tables = [];

    for (let id in resources) {
      let resource = resources[id];
      let properties = resource.Properties;

      if (resource.Type != 'AWS::DynamoDB::Table') {
        continue;
      }

      tables.push({
        name: id,
        properties: resource.Properties,
      });
    }

    return tables;
  }

  createTables(definitions) {
    const tables = definitions
    .map(definition => {
      if (!definition.properties.TableName) {
        definition.properties.TableName = definition.name;
      }

      return definition.properties;
    })
    .map(request => this.client
      .createTable(request)
      .promise()
      .catch(this.onCreateTableError.bind(this)))
    ;

    return Promise.all(tables);
  }

  onCreateTableError(err) {
    throw new Error(err);
  }
}
