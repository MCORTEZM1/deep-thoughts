const jwt = require('jsonwebtoken');

// if secret is ever compromised, you must generate a new one. Should be stored in a .env file
const secret = 'this-is-secret-af';
const expiration = '2h';

module.exports = {
    // expects a user object and will assign the given values to the token
    signToken: function({ username, email, _id}) {
        const payload = { username, email, _id };

        // secret has nothing to do with encoding. Secret enables the server to verify whether it recognizes the token.
        // tokens have the option for an expiration.
        return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
    },
    // middleware to authenticate JWTs 
    authMiddleware: function({ req }) {
        // allows token to be sent via req.body, req.query, or headers
        let token = req.body.token || req.query.token || req.headers.authorization;

        // seperate "Bearer" from "<tokenvalue>"
        if(req.headers.authorization) {
            token = token
                .split(' ')
                .pop()
                .trim();
        }

        // if no token, return request object as is 
        if (!token) {
            return req;
        }

        // we dont want and error thrown on every request- users with an invalid token should
        // still be able to request adn see all thoughts, so wrapped verify in a try/catch
        try {
            // decode and attach user data to request object
            const { data } = jwt.verify(token, secret, { maxAge: expiration });
            req.user = data;
        } catch {
            console.log('invalid token')
        }

        // return updated request object
        return req;
    }
};