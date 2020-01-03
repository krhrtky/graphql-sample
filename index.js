const { ApolloServer } = require('apollo-server');

const typeDefs = `
  type Query {
    totalPhotos: Int!
  }
  type Mutation {
    postPhoto(name: String! description: String): Boolean!
  }
  `;

const photos = [];
const resolvers = {
  Query: {
    // 写真を格納した配列の長さを返す
    totalPhotos: () => 42,
  },
  // postPhotoミューテションと対応するリゾルバ
  Mutation: {
    postPhoto(parent, args) {
      photos.push(args);
      return true;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server
  .listen()
  .then(({ url }) => console.log(`GraphQL Service running on ${url}`));
