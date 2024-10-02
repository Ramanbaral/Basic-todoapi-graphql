import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

const todos = [
  {
    id: 1,
    title: "some todo",
    status: "NOT_DONE",
    user: 5,
  },
  {
    id: 2,
    title: "some todo22",
    status: "DOING",
    user: 3,
  },
];

const typeDefs = `
  type Todo {
    id: ID!
    title: String! 
    status: String! 
    user: Int! 
  }

  type Query {
    todos : [Todo]
    todo(n: Int) : Todo!
  }

  type Mutation {
    addTODO(title: String, user: Int) : String
    deleteTODO(id: ID) : Boolean
    updateStatus(id: ID) : Boolean
  }
`;

const resolvers = {
  Query: {
    todos: () => todos,
    todo: (_, { n }) => {
      return todos[n];
    },
  },

  Mutation: {
    addTODO: (_, { title, user }) => {
      todos.push({
        id: todos.length + 1,
        title,
        status: "NOT_DONE",
        user,
      });
      return "TODO Successfully Added";
    },

    deleteTODO: (_, { id }) => {
      //logic to delete todo
    },

    updateStatus: (_, { id }) => {
      //logic to update status 
    }
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

startStandaloneServer(server, {
  listen: { port: 3000 },
}).then(({ url }) => {
  console.log(`server ready on : ${url}`);
});
