require('dotenv').config();

// Imports
import express from 'express';
import graphqlApplication from './graphql';
import { ApolloServer } from 'apollo-server-express';
import prisma from './lib/prisma';

async function start() {
  const PORT = 3000;
  const app = express();
  const port = PORT;

  let schema = graphqlApplication.createSchemaForApollo();
  const server = new ApolloServer({
    schema,
    context: ({ req }: { req: any }) => {
      return {
        prisma
      };
    }
  });
  await server.start();
  server.applyMiddleware({ app });

  app.listen(port);
  console.log(`Server listening on port ${port}.`);
}

start();
