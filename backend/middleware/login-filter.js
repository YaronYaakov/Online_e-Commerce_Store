const { expressjwt: expressJwt } = require('express-jwt');
const config = require('../config.json');

// Extracting the text from the secret's JSON
let { secret } = config;
//console.log(secret);

function authenticateJwtRequestToken() {
    // Load secret and algorithm into expressJwt
    return expressJwt({ 
        secret: secret, 
        algorithms: ['HS256'] 
    }).unless({
        path: [
            // public routes that don't require authentication
            '/users/login',
            '/users',
            '/statistics',
            '/cities',
            /uploads\/.*/,
        ]
    });
}

module.exports = authenticateJwtRequestToken;