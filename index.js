const { ApolloServer } = require('apollo-server');

const typeDefs = `
  type User {
    """
    ユーザーの一位のGithHubログインID
    """
    githubLogin: ID!
    """
    ユーザーの姓名
    """
    name: String
    """
    ユーザーのGitHubプロフィール画像のURL
    """
    avatoar: String
    """
    このユーザーが投稿した全写真
    """
    postedPhotos: [Photo!]!
  }
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
    postedBy: User!
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

const users = [
  { githubLogin: 'mHattup', name: 'Mike Hattrup' },
  { githubLogin: 'gPlake', name: 'Glen Plake Hattrup' },
  { githubLogin: 'sSchmidt', name: 'Scot Schmidt' },
];

// 一意なキー(ID)
let _id = 0;
const photos = [
  {
    id: '1',
    name: 'Dropping the Heart Chute',
    description: 'The  heart chute is one of my favorite chutes',
    category: 'ACTION',
    githubUser: 'gPlake',
  },
  {
    id: '2',
    name: 'Enjoying the sunshine',
    category: 'SELFIE',
    githubUser: 'sSchmidt',
  },
  {
    id: '3',
    name: 'Gunbarrel 25',
    description: '25 laps on gunbarrel today',
    category: 'LANDSCAPE',
    githubUser: 'sSchmidt',
  },
];

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
    postedBy: parent => users.find(u => u.githubUser === parent.githubLogin),
  },
  User: {
    postedPhotos: parent =>
      photos.filter(p => p.githubUser === parent.githubLogin),
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server
  .listen()
  .then(({ url }) => console.log(`GraphQL Service running on ${url}`));
