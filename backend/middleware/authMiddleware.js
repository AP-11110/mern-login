const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')

const protect = asyncHandler(async (req, res, next) => {
    let token;

    // tokens start with 'Bearer...'
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // get token from header and split so that the 'Bearer' is excluded
            token = req.headers.authorization.split(' ')[1];

            // verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // get user from the token, id set in the generate token function
            // assigning to req.user so it can be accessed in any route that's protected
            req.user = await User.findById(decoded.id).select('-password') // exclude the password

            next();
        } catch (error) {
            console.log(error);
            res.status(401);
            throw new Error('Not authorized');
        }
    }

    if(!token) {
        res.status(401);
        throw new Error('Not authorized, no token');
    }
})

module.exports = { protect }