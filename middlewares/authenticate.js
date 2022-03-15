const jwt = require('jsonwebtoken');
const APIResponse = require('../models/apiresponse')

module.exports = (req, res, next) => {
    if (req.body.token) {
        const token = req.body.token;
        jwt.verify(token, process.env.SECRET_KEY);
        next();

    } else {
        let apiResponse = new APIResponse(1, "Unauthenticated");
        res.json(apiResponse);
    }
}