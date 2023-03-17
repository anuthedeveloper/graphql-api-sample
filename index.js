const express = require("express");
const cors = require("cors");
const { graphqlHTTP } = require("express-graphql");
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLBoolean,
} = require("graphql");

const app = express();

app.use(cors({ origin: true }));
app.use(express.json());

const users = [
  { id: 1, name: "John Clever", gender: "male" },
  { id: 2, name: "James Colnel", gender: "male" },
  { id: 3, name: "Angleina Joe", gender: "female" },
  { id: 4, name: "Tyle Drey", gender: "female" },
  { id: 5, name: "Flemma Edison", gender: "male" },
  { id: 6, name: "Scott Houston", gender: "male" },
];

const login = [
  { id: 1, username: "Joc1", password: "wed32d", status: true, userid: 1 },
  { id: 2, username: "angel", password: "dhfhd", status: true, userid: 3 },
  { id: 3, username: "scoton", password: "1edce", status: true, userid: 6 },
  { id: 4, username: "Tyrey", password: "ftec2", status: true, userid: 4 },
  {
    id: 5,
    username: "fleed",
    password: "cs323",
    status: false,
    userid: 5,
  },
  {
    id: 6,
    username: "jamcol",
    password: "fvd32s",
    status: true,
    userid: 2,
  },
];

const UserType = new GraphQLObjectType({
  name: "Users",
  description: "All active uses",
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString) },
    gender: { type: GraphQLNonNull(GraphQLString) },
  }),
});

const LoginType = new GraphQLObjectType({
  name: "Login",
  description: "All active users details",
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    username: { type: GraphQLNonNull(GraphQLString) },
    status: { type: GraphQLNonNull(GraphQLBoolean) },
    user: {
      type: UserType,
      resolve: (login) => {
        return users.find((user) => user.id === login.userid);
      },
    },
  }),
});

const RootQueryType = new GraphQLObjectType({
  name: "Query",
  description: "Root Query",
  fields: () => ({
    user: {
      type: UserType,
      description: "Single user",
      args: {
        id: { type: GraphQLInt },
      },
      resolve: (parent, args) => users.find((user) => user.id === args.id),
    },
    users: {
      type: new GraphQLList(UserType),
      description: "List of all users",
      resolve: () => users,
    },
    loginAccount: {
      type: LoginType,
      description: "Single account",
      args: {
        id: { type: GraphQLInt },
      },
      resolve: (parent, args) => login.find((log) => log.id === args.id),
    },
    login: {
      type: new GraphQLList(LoginType),
      description: "All active users account",
      resolve: () => login.filter((log) => log.status),
    },
    message: {
      type: GraphQLString,
      description: "Welcome Message",
      resolve: () => "Welcome to express graphql",
    },
  }),
});

const RootMutationType = new GraphQLObjectType({
  name: "Mutation",
  description: "Root Mutation",
  fields: () => ({
    addUser: {
      type: UserType,
      description: "Add new user",
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        gender: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve: (parent, args) => {
        const user = {
          id: users.length + 1,
          name: args.name,
          gender: args.gender,
        };
        users.push(user);
        return user;
      },
    },
  }),
});

const schema = new GraphQLSchema({
  query: RootQueryType,
  mutation: RootMutationType,
});

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    graphiql: true,
  })
);
const port = 5000;
app.listen(port, () => console.log("app listening on port ", port));
