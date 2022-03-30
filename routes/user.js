const express = require("express");
const router = express.Router();
const APIResponse = require("../models/apiresponse");
const login = require("../utilities/login");


router.use(express.json());

router.post('/signup', async (req, res) => {
    
    if (!req.body.email || !req.body.password || !req.body.firstName || !req.body.lastName) {
        let apiResponse = new APIResponse(0, "Invalid Data");
        res.json(apiResponse);
    }
    else {

        const hashed = await global.bcrypt.hash(req.body.password, 10);
        await global.prismaClient.user.create({
            data: {
                email: req.body.email,
                password: hashed,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
            }
        });
        let apiResponse = new APIResponse(0, `${req.body.firstName} signed up!`, req.body.email);
        res.json(apiResponse);

    }
});

router.post('/login', async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    let auth;

    if (!email || !password) {
        let apiResponse = new APIResponse(1, "Invalid email or password");
        res.json(apiResponse);
    } else {

        auth = await global.prismaClient.user.findUnique({
            where: {
                email: req.body.email
            },
            include: {
                favourites: {
                    select: {
                        id: true
                    }
                },
            }
        });

        await login(auth, password, res);
    }

});

router.put('/favourites', async (req, res) => {
    // req.body = { userId: Number, recipeId: Number, action: "connect" | "disconnect" }
    const { recipeId, userId, action } = req.body;

    await global.prismaClient.user.update({
        where: {
            id: parseInt(userId)
        },
        data: {
            favourites: {
                [action]: { id: recipeId }
            }
        }
    });

    let apiResponse = new APIResponse(0, `Updated favourites.`);
    res.json(apiResponse);
});

module.exports = router;