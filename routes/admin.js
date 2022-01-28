const express = require('express');
const router = express.Router();
const APIResponse = require('../models/apiresponse');
const login = require("../utilities/login");

router.use(express.json());

router.post('/login', async (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    let auth;

    if (!username || !password) {
        let apiResponse = new APIResponse(1, "Invalid username or password");
        res.status(200).json(apiResponse);
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

router.post('/recipe', async (req, res, next) => {
    // req.body = { recipeName, desc }
    const recipeName = req.body.recipeName;
    const desc = req.body.desc;

    await prisma.recipe.create({
        data: {
            recipeName: recipeName,
            desc: desc
        }
    });

    let apiResponse = new APIResponse(0, `${recipeName} recipe created successfully`);
    res.json(apiResponse);
});

// router.get('/recipes', async (req, res) => {
//     const allRecipes = await global.prismaClient.recipe.findMany();

//     let apiResponse = new APIResponse(0, "Successfully fetched all recipes", allRecipes);
//     res.json(apiResponse);

// });

router.get('/recipe/:id', async (req, res) => {

    const recipe = await global.prismaClient.recipe.findUnique({
        where: {
            id: parseInt(req.params.id)
        }
    });

    let apiResponse = new APIResponse(0, "Fetched recipe successfully", recipe);
    res.json(apiResponse);

});

router.put('/recipe/:id', async (req, res) => {
    // req.body = { recipeName, desc }
    const recipeName = req.body.recipeName;
    const desc = req.body.desc;

    await global.prismaClient.recipe.update({
        where: {
            id: parseInt(req.params.id)
        },
        data: {
            recipeName: recipeName,
            desc: desc
        }
    });

    let apiResponse = new APIResponse(0, `Recipe ${req.params.id} was updated`);
    res.json(apiResponse);
});

router.delete('/recipe/:id', async (req, res) => {
    await global.prismaClient.recipe.delete({
        where: {
            id: parseInt(req.params.id)
        }
    });

    let apiResponse = new APIResponse(0, "Recipe deleted");
    res.json(apiResponse);
});

module.exports = router;