import { describe, expect, test } from '@jest/globals';

import { TestFilterDeleter } from './filterDeleter.js';
import { Category, Comparator } from './filterType.js';
import { buildServer } from './server.js';

describe('delete filter', () => {
  test('uses filter deleter to delete filter', async () => {
    const deleter = new TestFilterDeleter({
      responses: {
        'test-user-id|test-id': {
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
      },
    });
    const server = buildServer();
    const result = await server.executeOperation(
      {
        query: DELETE_FILTER_MUTATION,
        variables: {
          input: { id: 'test-id' },
        },
      },
      {
        contextValue: {
          filterDeleter: deleter,
          userId: 'test-user-id',
        },
      },
    );
    expect(deleter.calls).toStrictEqual(['test-user-id|test-id']);
    expect(result.body.kind).toBe('single');
    if (result.body.kind !== 'single') throw new Error('not single response');
    expect(result.body.singleResult.data).toMatchObject({
      deleteFilter: {
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
  });

  test('returns error when filter deleter throws NoItemError', async () => {
    const deleter = new TestFilterDeleter();
    const server = buildServer();
    const result = await server.executeOperation(
      {
        query: DELETE_FILTER_MUTATION,
        variables: {
          input: { id: 'test-id' },
        },
      },
      {
        contextValue: {
          filterDeleter: deleter,
          userId: 'test-user-id',
        },
      },
    );
    expect(deleter.calls).toStrictEqual(['test-user-id|test-id']);
    expect(result.body.kind).toBe('single');
    if (result.body.kind !== 'single') throw new Error('not single response');
    const errors = result.body.singleResult.errors;
    expect(errors).toHaveLength(1);
    expect(errors?.[0]).toMatchObject({
      message: "No filter exists with id 'test-id' for user 'test-user-id'",
    });
  });
});

const DELETE_FILTER_MUTATION = `#graphql
  mutation DeleteFilter($input: DeleteFilterInput!) {
    deleteFilter(input: $input) {
      categoryToAssign
      id
      matchers {
        comparator
        expectedValue
        property
      }
      tagToAssign
    }
  }
`;
