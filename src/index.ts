import express from "express";
import { createHandler } from "graphql-http/lib/use/express";
import { buildSchema } from "graphql";
import { ruruHTML } from "ruru/server";

const schema = buildSchema(`
  type Query {
    hello: String! 
    user: User
    random(n: Int!): [Float]
    rollThreeDice: [Int]
    getMsg: String!
  }

  type User {
    id: ID 
    name: String 
    email: String
}

type Mutation {
  setMsg(msg: String!): String
}
`);

const m: {msg?: string} = {msg: 'smt'};

const root = {
  hello() {
    return "Hello world from graphql";
  },
  user() {
    return {
      id: 123,
      name: "user",
      email: "test@test.com",
    };
  },
  random(args: { n: number }) {
    let out: number[] = [];
    for (let i = 0; i < args.n; i++) {
      out.push(100 * Math.random());
    }
    return out;
  },
  rollThreeDice() {
    return [1, 2, 3].map((_) => Math.floor(1 + Math.random() * 6));
  },
  setMsg({ msg }: {msg: string}) {
    m['msg'] = msg;
  }, 
  getMsg() {
    return m['msg'];
  }
};

const PORT = 3000;
const app = express();

app.get("/", (req, res) => {
  res.type(".html");
  res.end(ruruHTML({ endpoint: "/graphql" }));
});

app.all(
  "/graphql",
  createHandler({
    schema: schema,
    rootValue: root,
  })
);

app.listen(PORT, () => {
  console.log(`Server Listening on: ${PORT} ...`);
});
