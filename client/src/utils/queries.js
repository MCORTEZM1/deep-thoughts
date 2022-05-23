import { gql } from '@apollo/client';

export const QUERY_THOUGHTS = gql`
    query thoughts ($username: String) {
        thoughts(username: $username) {
            _id
            thoughtText
            createdAt
            username
            reactionCount
            reactions {
                _id
                createdAt
                username
                reactionBody
            }
        }
    }
`;

export const QUERY_THOUGHT = gql`
    query Thought($id: ID!) {
        thought(_id: $id) {
        _id
        thoughtText
        createdAt
        username
        reactionCount
        reactions {
            _id
            createdAt
            username
            reactionBody
        }
        }
    }
`;

export const QUERY_USER = gql`
    query user($username: String!) {
        user(username: $username) {
            _id
            username
            email
            friendCount
            friends {
                _id
                username
            }
            thoughts {
                _id
                thoughtText
                createdAt
                reactionCount
            }
        }
    }
`;

// different syntax. There are no variables being passed in, so we can simply name the query and graphql will handle the rest
export const QUERY_ME = gql`
    {
        me {
            _id
            username
            email
            friendCount
            thoughts {
                _id
                thoughtText
                createdAt
                reactionCount
                reactions {
                _id
                createdAt
                reactionBody
                username
                }
            }
            friends {
                _id
                username
            }
        }
    }
`;


export const QUERY_ME_BASIC = gql`
    {
        me {
            _id
            username
            email
            friendCount
            friends {
                _id
                username
            }
        }
    }
`;