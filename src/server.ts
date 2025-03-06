import { ApolloServer } from '@apollo/server';
import {
  startServerAndCreateLambdaHandler,
  handlers,
} from '@as-integrations/aws-lambda';

export function buildServer() {
  return new ApolloServer({
    resolvers,
    typeDefs,
  });
}

const typeDefs = `#graphql
	type Query {
		hello: String
	}
`;

const resolvers = {
  Query: {
    hello: () => 'world',
  },
};
