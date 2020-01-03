const { ApolloServer } = require('apollo-server');

const typeDefs = `
  enum PhotoCategory {
    SELFIE
    PORTRAIT
    ACTION
    LANDSCAPE
    GRAPHIC
  }

  # 型定義
  type Photo {
    id: ID!
    url: String!
    name: String!
    description: String
    category: PhotoCategory!
  }

  input PostPhotoInput {
      "新しい写真の名前"
      name: String!
      "(optional)写真のかんたんな説明"
      description: String
      "(optional)写真のカテゴリ"
      category: PhotoCategory=PORTRAIT
  }

  type Query {
    totalPhotos: Int!
    allPhotos: [Photo]!
  }
  type Mutation {
    postPhoto(input: PostPhotoInput!): Photo!
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
        ...args.input,
      };
      photos.push(newPhoto);
      // 作成した写真情報を返す
      return newPhoto;
    },
  },
  Photo: {
    url: parent => `http://yoursite.com/img/${parent.id}.jpg`,
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server
  .listen()
  .then(({ url }) => console.log(`GraphQL Service running on ${url}`));
