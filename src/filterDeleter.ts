import { ResourceNotFoundException } from '@aws-sdk/client-dynamodb';
import { DeleteCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

import type { Filter } from './filterType.js';
import type { Logger } from './logger.js';

export interface FilterDeleter {
  delete: (input: { id: string; userId: string }) => Promise<Filter>;
}

export class DynamoFilterDeleter implements FilterDeleter {
  private readonly dynamoClient: DynamoDBDocumentClient;

  private readonly logger: Logger;

  constructor({
    dynamoClient,
    logger,
  }: {
    dynamoClient: DynamoDBDocumentClient;
    logger: Logger;
  }) {
    this.dynamoClient = dynamoClient;
    this.logger = logger;
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
    try {
      const result = await this.dynamoClient.send(command);
      if (result?.Attributes === undefined)
        throw new NoItemError({ id, userId });
      return result.Attributes as Filter;
    } catch (error) {
      if (error instanceof ResourceNotFoundException) {
        const error = new NoItemError({ id, userId });
        this.logger.error(error.message);
        throw error;
      } else {
        this.logger.error(
          `filter deleter enountered unexpected error ${error}`,
        );
        throw error;
      }
    }
  }
}

export class TestFilterDeleter implements FilterDeleter {
  readonly calls: string[];
  private readonly responses: Record<string, Filter>;

  constructor({ responses = {} }: { responses?: Record<string, Filter> } = {}) {
    this.calls = [];
    this.responses = responses;
  }

  async delete({
    id,
    userId,
  }: {
    id: string;
    userId: string;
  }): Promise<Filter> {
    const serializedInput = `${userId}|${id}`;
    this.calls.push(serializedInput);
    const response = this.responses[serializedInput];
    if (response === undefined) throw new NoItemError({ id, userId });
    return response;
  }
}

export class FilterDeleterError extends Error {
  constructor(message?: string) {
    if (message !== undefined) super(message);
    else super('Filter Deleter Error');
  }
}

export class NoItemError extends FilterDeleterError {
  constructor({ id, userId }: { id: string; userId: string }) {
    super(`No filter exists with id '${id}' for user '${userId}'`);
  }
}
