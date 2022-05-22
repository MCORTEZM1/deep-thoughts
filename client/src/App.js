import React from 'react';
import { ApolloProvider, ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

import Header from './components/Header';
import Footer from './components/Footer';

import Home from './pages/Home';

// establish link to graphql server. There are many options and configurations that can be added here.
const httpLink = createHttpLink({
  // uniform resource identifier
  uri:'/graphql',
});

// use ApolloClient constructor to instantiate teh apollo client instance and create the connection
// to the API endpoint. We also instantiate a new cache for efficient API requests.
const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
})



function App() {
  return (
    <ApolloProvider client={client}>
      <div className='flex-column justify-flex-start min-100-vh'>
        <Header />
        <div className='container'>
          <Home />
        </div>
        <Footer />
      </div>
    </ApolloProvider>
  );
}

export default App;
