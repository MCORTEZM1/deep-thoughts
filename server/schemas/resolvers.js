const { User, Thought } = require('../models');


// resolvers handle query responses 
const resolvers = {
    Query: {
// parent not used here, but as a placeholder to access 2nd parameter
// resolvers have 4 arguments that can be passed: 1. parent 2. arguments 3. context 4. info

        // get all thoughts/ or thoughts by username (flexibility is given by typeDefs not requiring '!' w username: String!)
        thoughts: async (parent, { username }) => {
            // if there is a username, it will be attached to the params as an object w username key to set value, if there is not, all thoughts will be returned
            const params = username ? { username } : {};
            return Thought.find(params).sort({ createdAt: -1 });
        },
        // get thoughts by user id
        thought: async (parent, { _id }) => {
            return Thought.findOne({ _id });
        },
        // get all users 
        users: async () => {
            return User.find()
                .select('-__v -password')
                .populate('friends')
                .populate('thoughts');
        },
        // get user by username
        user: async (parent, { username }) => {
            return User.findOne({ username })
                .select('-__v -password')
                .populate('friends')
                .populate('thoughts');
        }
    }
};


module.exports = resolvers;