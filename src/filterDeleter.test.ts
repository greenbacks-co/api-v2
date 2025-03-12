import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DeleteCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { mockClient } from 'aws-sdk-client-mock';
import { describe, expect, test } from '@jest/globals';

import { DynamoFilterDeleter, NoItemError } from './filterDeleter.js';
import { Category, Comparator } from './filterType.js';
import { SilentLogger } from './logger.js';

describe('dynamo filter deleter', () => {
  test('deletes item with sdk and returns result ', async () => {
    mockClient(DynamoDBDocumentClient)
      .on(DeleteCommand, {
        Key: {
          id: 'test-id',
          userId: 'test-user-id',
        },
        TableName: 'filters',
      })
      .resolves({
        Attributes: {
          categoryToAssign: Category.Spending,
          id: 'test-id',
          matchers: [
            {
              comparator: Comparator.Equals,
              expectedValue: 'test-name',
              property: 'name',
            },
          ],
        },
      });
    const ddb = new DynamoDBClient();
    const client = DynamoDBDocumentClient.from(ddb);
    const deleter = new DynamoFilterDeleter({
      dynamoClient: client,
      logger: new SilentLogger(),
    });
    const result = await deleter.delete({
      id: 'test-id',
      userId: 'test-user-id',
    });
    expect(result).toMatchObject({
      categoryToAssign: Category.Spending,
      id: 'test-id',
      matchers: [
        {
          comparator: Comparator.Equals,
          expectedValue: 'test-name',
          property: 'name',
        },
      ],
    });
  });

  test('throws NoItemError', async () => {
    mockClient(DynamoDBDocumentClient).on(DeleteCommand, {
      Key: {
        id: 'test-id',
        userId: 'test-user-id',
      },
      TableName: 'filters',
    });
    const ddb = new DynamoDBClient();
    const client = DynamoDBDocumentClient.from(ddb);
    const deleter = new DynamoFilterDeleter({
      dynamoClient: client,
      logger: new SilentLogger(),
    });
    expect(() =>
      deleter.delete({
        id: 'test-id',
        userId: 'test-user-id',
      }),
    ).rejects.toThrow(NoItemError);
  });
});
