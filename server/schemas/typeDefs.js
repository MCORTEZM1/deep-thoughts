// import the gql tagged template function
const { gql } = require('apollo-server-express');

// create typeDefs
// model type definitions define what is returned on query
// passing thoughts(username: ...) this query COULD recieve a parameter. Here to access thought by username
const typeDefs = gql`
    type User {
        _id: ID
        username: String
        email: String
        friendCount: Int
        thoughts: [Thought]
        friends: [User]
    }

    type Thought {
        _id: ID
        thoughtText: String
        createdAt: String
        username: String
        reactionCount: Int
        reactions: [Reaction]
    }

    type Reaction {
        _id: ID
        reactionBody: String
        createdAt: String
        username: String
    }

    type Query {
        users: [User]
        user(username: String!): User
        thoughts(username: String): [Thought]
        thought(_id: ID): Thought
    }    
`;


// export the typeDefs
module.exports = typeDefs;