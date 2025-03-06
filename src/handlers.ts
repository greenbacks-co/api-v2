import {
  startServerAndCreateLambdaHandler,
  handlers,
} from '@as-integrations/aws-lambda';

import { buildServer } from './server.js';

export const handler = startServerAndCreateLambdaHandler(
  // @ts-expect-error: seems to be some mismatch inside apollo :(
  buildServer(),
  handlers.createAPIGatewayProxyEventV2RequestHandler(),
);
