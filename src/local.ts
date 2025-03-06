import { startStandaloneServer } from '@apollo/server/standalone';

import { buildServer } from './server.js';

const { url } = await startStandaloneServer(buildServer(), {
  listen: { port: 4000 },
});

console.log(`Server ready at ${url}`);
