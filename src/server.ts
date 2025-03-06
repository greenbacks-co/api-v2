import { ApolloServer } from '@apollo/server';

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
