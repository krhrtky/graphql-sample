const { ApolloServer } = require('apollo-server-express');
const expressPlayground = require('graphql-playground-middleware-express')
  .default;
const express = require('express');
const { GraphQLScalarType } = require('graphql');
const { readFileSync } = require('fs');

const app = express();

const typeDefs = readFileSync('./typeDefs.graphql', 'UTF-8');

const users = [
  { githubLogin: 'mHattup', name: 'Mike Hattrup' },
  { githubLogin: 'gPlake', name: 'Glen Plake Hattrup' },
  { githubLogin: 'sSchmidt', name: 'Scot Schmidt' },
];

const tags = [
  { photoID: '1', userID: 'gPlake' },
  { photoID: '2', userID: 'sSchmidt' },
  { photoID: '2', userID: 'mHattup' },
  { photoID: '2', userID: 'gPlake' },
];

// 一意なキー(IDgPlake
let _id = 0;
const photos = [
  {
    id: '1',
    name: 'Dropping the Heart Chute',
    description: 'The  heart chute is one of my favorite chutes',
    category: 'ACTION',
    githubUser: 'gPlake',
    created: '3-28-1977',
  },
  {
    id: '2',
    name: 'Enjoying the sunshine',
    category: 'SELFIE',
    githubUser: 'sSchmidt',
    created: '1-2-1985',
  },
  {
    id: '3',
    name: 'Gunbarrel 25',
    description: '25 laps on gunbarrel today',
    category: 'LANDSCAPE',
    githubUser: 'sSchmidt',
    created: '2018-04-15T19:09:57.308Z',
  },
];
const resolvers = require('./resolvers');

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.applyMiddleware({ app });
app.get('/', (_, res) => res.send('Welcome to the PhotoShare API'));
app.get('/playground', expressPlayground({ endpoint: '/graphql' }));

app.listen({ port: 4000 }, () => {
  console.log(
    `GraphQL Server running @ http://localhost:4000${server.graphqlPath}`
  );
});
