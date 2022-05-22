const express = require('express');
//  import apollo server 
const { ApolloServer } = require('apollo-server-express');

// import typeDefs and resolvers 
const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');

const PORT = process.env.PORT || 3001;
// create a new Apollo server and pass in our schema data so it knows what our API looks like and how to resolve requests.
const server = new ApolloServer({
  typeDefs,
  resolvers
});

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());


// create a new instance of an Apollo server with the GraphQL schema 
const startApolloServer = async (typeDefs, resolvers) => {
  await server.start();
  
  // integrate our Apollo server with the Express application as middleware
  // this creates a special /graphql endpoint for the express.js server that will
  // server as the main endpoint for accessing the entire API [w built in test tool]
  server.applyMiddleware({ app });

  // access database from Apollo server
  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      // log where we can test our GQL API 
      console.log(`Use GraphQL at https://localhost/${PORT}${server.graphqlPath}`);
    });
  });
};

// call the async function to start the server 
startApolloServer(typeDefs, resolvers);