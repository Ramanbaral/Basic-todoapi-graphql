import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

import { generateRandomNumber } from "./utils";

let todos = [
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
    todo(id: Int) : Todo
  }

  type Mutation {
    addTODO(title: String, user: Int) : Boolean
    deleteTODO(id: ID) : Boolean
    updateStatus(id: ID, newStatus: String) : Boolean
  }
`;

const resolvers = {
  Query: {
    todos: () => todos,
    todo: (_, { id }) => {
      const todo = todos.find((t) => t.id === parseInt(id));
      if (todo) return todo;
    },
  },

  Mutation: {
    addTODO: (_, { title, user }) => {
      todos.push({
        id: todos.length + generateRandomNumber(),
        title,
        status: "NOT_DONE",
        user,
      });
      return true;
    },

    deleteTODO: (_, { id }) => {
      const todoIndex = todos.findIndex((todo) => todo.id == id);
      if (todoIndex === -1) return false;

      todos.splice(todoIndex, 1);
      return true;
    },

    updateStatus: (_, { id, newStatus }) => {
      const todoIndex = todos.findIndex((todo) => todo.id === parseInt(id));
      if (todoIndex === -1) return false;
      todos[todoIndex].status = newStatus;
      return true;
    },
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
