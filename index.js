const { ApolloServer } = require('apollo-server');

const typeDefs = `
  # 型定義
  type Photo {
    id: ID!
    url: String!
    name: String!
    description: String
  }

  type Query {
    totalPhotos: Int!
    allPhotos: [Photo]!
  }
  type Mutation {
    postPhoto(name: String! description: String): Photo!
  }
  `;

// 一意なキー(ID)
let _id = 0;
const photos = [];

const resolvers = {
  Query: {
    // 写真を格納した配列の長さを返す
    totalPhotos: () => photos.length,
    allPhotos: () => photos,
  },
  // postPhotoミューテションと対応するリゾルバ
  Mutation: {
    postPhoto(_, args) {
      // 新しい写真情報を作成
      const newPhoto = {
        id: _id++,
        ...args,
      };
      photos.push(newPhoto);
      // 作成した写真情報を返す
      return newPhoto;
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
