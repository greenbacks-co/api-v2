import { startStandaloneServer } from '@apollo/server/standalone';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

import { DynamoFilterDeleter } from './filterDeleter.js';
import { ConsoleLogger } from './logger.js';
import { buildServer, createContextGenerator } from './server.js';

const logger = new ConsoleLogger();

const ddb = new DynamoDBClient();

const filterDeleter = new DynamoFilterDeleter({
  dynamoClient: DynamoDBDocumentClient.from(ddb),
  logger,
});

const generateContext = createContextGenerator({ filterDeleter });

const server = buildServer();

const { url } = await startStandaloneServer(server, {
  context: generateContext,
  listen: { port: 4000 },
});

console.log(`Server ready at ${url}`);
