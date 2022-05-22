const { User, Thought } = require('../models');
const { AuthenticationError } = require ('apollo-server-express');
const { signToken } = require('../utils/auth');


// resolvers handle query and mutation responses 
const resolvers = {
    Query: {
        // resolvers have 4 arguments that can be passed: 1. parent 2. arguments 3. context 4. info
        
        // use me to verify user is logged in 
        me: async (parent, args, context) => {
            // if context.user exists, return the userData
            if(context.user) {
                const userData = await User.findOne({ _id: context.user._id })
                    .select('-__v -password')
                    .populate('friends')
                    .populate('thoughts');

                return userData;
            }
            
            // if no context.user exists, we know that the user is not authenticated
            throw new AuthenticationError('Not logged in');
        },
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
    },
    Mutation: {
        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);

            // return token and user: token is required in Auth typeDefs
            return { token, user };
        },
        login: async (parent, {email, password}) => {
            const user = await User.findOne({ email });
            if(!user) {
                throw new AuthenticationError('Incorrect credentials');
            }

            const correctPw = await user.isCorrectPassword(password);
            if(!correctPw){
                throw new AuthenticationError('Incorrect credentials');
            }

            const token = signToken(user);
            return  { token, user};
        },
        addThought: async (parent, args, context) => {
            if (context.user) {
                const thought = await Thought.create({ ...args, username: context.user.username });

                await User.findByIdAndUpdate(
                    { _id: context.user._id },
                    { $push: {thoughts: thought._id }},
                    { new: true }
                );

                return thought;
            }

            throw new AuthenticationError('You need to be logged in!');
        },
        addReaction: async (parent, { thoughtId, reactionBody }, context) => {
            if (context.user) {
                const updatedThought = await Thought.findOneAndUpdate(
                    { _id: thoughtId },
                    { $push: { reactions: { reactionBody, username: context.user.username }}},
                    { new: true, runValidators: true }
                );

                return updatedThought;
            }

            throw new AuthenticationError('You need to be logged in!');
        },
        addFriend: async (parent, { friendId }, context) => {
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    {_id: context.user._id},
                    { $addToSet: { friends: friendId }},
                    { new: true }
                ).populate('friends');

                return updatedUser;
            }
            
            throw new AuthenticationError('You need to be logged in!');
        }
    }
};


module.exports = resolvers;