const express = require('express');
const path = require('path');
const { authMiddleware } = require('./utils/auth')
//  import apollo server 
const { ApolloServer } = require('apollo-server-express');

// import typeDefs and resolvers 
const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');

const PORT = process.env.PORT || 3001;
// create a new Apollo server and pass in our schema data so it knows what our API looks like and how to resolve requests.
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware
  // this ensures every request performs an authetication check, and updated request object will be 
  // passed to the resolvers as 'context' parameter
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

 // ===== For Production Only: 
  // Serve up static assets when in production
  if (process.env.NODE_ENV === 'production') {
    // if node environments is in production, tell express.js server to serve
    // any files in the React application's build directory in the client folder.
    app.use(express.static(path.join(__dirname, '../client/build')));
    // build files do not contain dev dependencies 
  }

  // if user makes a get request to any location that doesnt have a specific route, respond with production ready
  // React front end code
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  })
 // ======  End =======


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