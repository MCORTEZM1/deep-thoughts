import React from 'react';
import { ApolloProvider, ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Header from './components/Header';
import Footer from './components/Footer';

import Home from './pages/Home';
import Login from './pages/Login';
import NoMatch from './pages/NoMatch';
import SingleThought from './pages/SingleThought';
import Profile from './pages/Profile';
import Signup from './pages/Signup';


// establish link to graphql server. There are many options and configurations that can be added here.
const httpLink = createHttpLink({
  // uniform resource identifier
  uri:'/graphql',
});

// create middleware function that will retrieve token and combine it with the httplink above
// `_` serves as placeholder to access second parameter for setContext
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('id_token');

  // retrieve token from local storage and set HTTP request headers of every request to include the token
  // whether it needs it or not. This is fine since if the request doesnt need the token, our server's resolver wont check for it.
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  }
})


// use ApolloClient constructor to instantiate teh apollo client instance and create the connection
// to the API endpoint. We also instantiate a new cache for efficient API requests.
const client = new ApolloClient({
  // we need to combine authlink and httplink objects so that every request retrieves the token and
  // sets the request headers before making the request to the API
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
})



function App() {
  return (
    // does this work?
    <ApolloProvider client={client}> {/* A special type of React component that we'll use to provide data to all of the other components.*/}
    
      <Router> {/*makes all child components on the page aware of the client-side routing that can now take place.*/}
        <div className='flex-column justify-flex-start min-100-vh'>
          <Header />
          <div className='container'>
            <Routes> {/* holds Route components */}
            {/* Route signifies this part of the pap as the place where content will change according to the URL route. */}
              <Route 
                /* When route is `/` the Home component will render here */ 
                path='/'
                element={<Home />}
              />
              <Route 
                /* When route is `/login` the Login component will render here, etc... */ 
                path='/login'
                element={<Login />}
              />
              <Route 
                path='/signup'
                element={<Signup />}
              />
              <Route 
                path= "/profile"
                element={<Profile />}
              />
              {/* had to include this route since it doesnt handle "path= `/profile/:username?`" */}
              <Route 
                path= '/profile/:username' 
                element={<Profile />}
              />
              <Route 
                path='/thought/:id'
                element={<SingleThought />}
              />
              <Route 
                path='/*'
                element={<NoMatch />}
              />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;
