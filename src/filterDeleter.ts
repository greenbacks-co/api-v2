import { DeleteCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

import { Category } from './filterType.js';
import type { Filter } from './filterType.js';

export interface FilterDeleter {
  delete: (input: { id: string; userId: string }) => Promise<Filter>;
}

export class DynamoFilterDeleter implements FilterDeleter {
  private readonly dynamoClient: DynamoDBDocumentClient;

  constructor({ dynamoClient }: { dynamoClient: DynamoDBDocumentClient }) {
    this.dynamoClient = dynamoClient;
  }

  async delete({
    id,
    userId,
  }: {
    id: string;
    userId: string;
  }): Promise<Filter> {
    const command = new DeleteCommand({
      Key: {
        id,
        userId,
      },
      TableName: 'filters',
    });
    const result = await this.dynamoClient.send(command);
    if (result?.Attributes === undefined) throw new NoItemError();
    return result.Attributes as Filter;
  }
}

export class FilterDeleterError extends Error {}

export class NoItemError extends FilterDeleterError {}
