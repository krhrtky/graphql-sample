const { GraphQLScalarType } = require('graphql');

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

module.exports = {
  Query: {
    // 写真を格納した配列の長さを返す
    totalPhotos: (_, __, { db }) =>
      db.collection('photos').estimatedDocumentCount(),
    allPhotos: (_, __, { db }) =>
      db
        .collection('photos')
        .find()
        .toArray(),
    totalUsers: (_, __, { db }) =>
      db.collection('users').estimatedDocumentCount(),
    allUsers: (_, __, { db }) =>
      db
        .collection('users')
        .find()
        .toArray(),
  },
  // postPhotoミューテションと対応するリゾルバ
  Mutation: {
    postPhoto(parent, args) {
      // 新しい写真情報を作成
      const newPhoto = {
        id: _id++,
        ...args.input,
        created: new Date(),
      };
      photos.push(newPhoto);
      // 作成した写真情報を返す
      return newPhoto;
    },
  },
  Photo: {
    url: parent => `http://yoursite.com/img/${parent.id}.jpg`,
    postedBy: parent => users.find(u => u.githubUser === parent.githubLogin),
    taggedUsers: parent =>
      tags
        .filter(tag => tag.photoID === parent.id)
        .map(tag => tag.userID)
        .map(userID => users.find(u => u.githubLogin === userID)),
  },
  User: {
    postedPhotos: parent =>
      photos.filter(p => p.githubUser === parent.githubLogin),
    inPhotos: parent =>
      tags
        .filter(tag => tag.userID === parent.id)
        .map(tag => tag.photoID)
        .map(photoID => photos.find(p => p.id === photoID)),
  },
  DateTime: new GraphQLScalarType({
    name: 'DateTime',
    description: 'A valid date time value',
    parseValue: value => new Date(value),
    serialize: value => new Date(value).toISOString(),
    parseLiteral: ast => ast.value,
  }),
};
