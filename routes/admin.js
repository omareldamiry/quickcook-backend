const { PrismaClient } = require('@prisma/client');
const bodyParser = require('body-parser');
const express = require('express');
const router = express.Router();
const login = require("../util/login");
const prisma = new PrismaClient();

router.use(bodyParser.json());

router.post('/login', async (req, res, next) => {
    await login(req, res, next, "admin");
});


router.get('/allusers', async (req, res) => {
    // req.params = null
    const allUsers = await global.prismaClient.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
        }
    });

    res.json({
        message: "TBA",
        users: allUsers
    });
});

router.post('/recipe', async (req, res, next) => {
    // req.body = { recipeName, desc }
    const recipeName = req.body.recipeName;
    const desc = req.body.desc;

    await prisma.recipe.create({
        data: {
            recipeName: recipeName || "Beans",
            desc: desc || "Perfectly cooked beans"
        }
    });

    res.json({
        message: `${recipeName} recipe created successfully`
    });
});

router.get('/recipes', async (req, res) => {
    const allRecipes = await global.prismaClient.recipe.findMany();

    res.json({
        recipes: allRecipes
    });

});

router.get('/recipe/:id', async (req, res) => {

    const recipe = await global.prismaClient.recipe.findUnique({
        where: {
            id: parseInt(req.params.id)
        }
    });

    res.json({
        recipe: recipe
    });

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

    res.json({
        message: `Recipe ${req.params.id} was updated`
    });
});

router.delete('/recipe/:id', async (req, res) => {
    await global.prismaClient.recipe.delete({
        where: {
            id: parseInt(req.params.id)
        }
    });

    res.json({
        message: "Recipe deleted"
    });
});

module.exports = router;