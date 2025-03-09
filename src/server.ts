import { ApolloServer } from '@apollo/server';

import type { FilterDeleter } from './filterDeleter.js';

export function buildServer() {
  return new ApolloServer<Context>({
    resolvers,
    typeDefs,
  });
}

interface Context {
  filterDeleter: FilterDeleter;
  userId: string;
}

export function createContextGenerator({
  filterDeleter,
}: {
  filterDeleter: FilterDeleter;
}): () => Promise<Context> {
  return async () => ({
    filterDeleter,
    userId: 'test',
  });
}

const typeDefs = `#graphql
	type Query {
		hello: String
	}

  type Mutation {
    deleteFilter(input: DeleteFilterInput!): Filter
  }

  input DeleteFilterInput {
    id: ID
  }

  type Filter {
    categoryToAssign: Category!
    id: ID!
    matchers: [Matcher]!
    tagToAssign: String
  }

  enum Category {
    earning
    hidden
    aaving
    spending
  }

  type Matcher {
    comparator: Comparator
    expectedValue: String!
    property: String!
  }

  enum Comparator {
    equals
    greaterThan
    lessThan
  }
`;

const resolvers = {
  Query: {
    hello: () => 'world',
  },
  Mutation: {
    deleteFilter: async (
      _: never,
      { input }: { input: DeleteFilterInput },
      context: Context,
    ) => {
      const result = await context.filterDeleter.delete({
        id: input.id,
        userId: context.userId,
      });
      return result;
    },
  },
};

interface DeleteFilterInput {
  id: string;
}
