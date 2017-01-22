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
    this.localDbArgs = localDbArgs;

    this.stack = yaml.load(fs.readFileSync(stackFile, 'utf8'), {
      schema: CLOUDFORMATION_SCHEMA,
      skipInvalid: true,
    });

    AWS.config.update({ endpoint: `http://localhost:${this.port}` });
  }

  setup() {
    dynamodb.launch(this.port, null, this.localDbArgs)
    .catch(err => {
      throw new Error(err);
    })
    .then(() => {
      this.client = new AWS.DynamoDB();

      const tableDefinitions = this.findTableDefinitions(this.stack);

      this.createTables(tableDefinitions).then(tables => {
        tables.map(table => {
          console.log(`Created Table: ${table.TableDescription.TableName}`);
        });
      })
      ;
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
