const express = require('express');
const router = express.Router();
const APIResponse = require('../models/apiresponse');
const login = require("../utilities/login");

router.use(express.json());

router.post('/login', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    let auth;

    if (!username || !password) {
        let apiResponse = new APIResponse(1, "Invalid username or password");
        res.json(apiResponse);
    } else {
        auth = await global.prismaClient.admin.findUnique({
            where: {
                username: req.body.username
            }
        });
        await login(auth, password, res);
    }

});


router.get('/allusers', async (req, res) => {
    const allUsers = await global.prismaClient.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
        }
    });

    let apiResponse = new APIResponse(0, "Successfully fetched all users", allUsers);
    res.json(apiResponse);
});



module.exports = router;