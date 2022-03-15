const express = require('express');
const authenticate = require('../middlewares/authenticate');
const router = express.Router();
const APIResponse = require('../models/apiresponse');
const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

router.use(express.json());

router.post('/', authenticate, async (req, res) => {
    /* Expecting an object of type: RecipeQuery = {
        name: string,
        ingredients: Ingredient[],
        sortDirection: string,
        sortField: string,
        pageNumber: number,
        pageSize: number,
    } */
    // const allRecipes = await prisma.recipe.findMany({
    //     include: {
    //         ingredients: true
    //     },
    //     _relevance: {
    //         fields: [req.body.sortField],
    //         sort: sortDirection
    //     },
    //     take: req.body.pageSize,
    //     skip: req.body.pageSize*req.body.pageNumber,
    // });
    const allRecipes = await prisma.recipe.findMany({
        include: {
            ingredients: true
        },
    });

    let apiResponse = new APIResponse(0, "Successfully fetched all recipes", allRecipes);
    res.json(apiResponse);
});

router.post('/recipe', async (req, res) => {
    // req.body = { name, desc, ingredients }
    const recipe = req.body;

    await global.prismaClient.recipe.create({
        data: {
            name: recipe.name,
            desc: recipe.desc,
            ingredients: {
                connect: recipe.ingredients.map(ingredient => { return { id: ingredient.id }; })
            }
        }
    });

    let apiResponse = new APIResponse(0, `${recipe.name} recipe created successfully`);
    res.json(apiResponse);
});

router.get('/:id', async (req, res) => {

    const recipe = await global.prismaClient.recipe.findUnique({
        where: {
            id: parseInt(req.params.id)
        }
    });

    let apiResponse = new APIResponse(0, "Fetched recipe successfully", recipe);
    res.json(apiResponse);

});

// TODO: Use recipe model here

router.put('/:id', async (req, res) => {
    // req.body = { name, desc, ingredients }
    const recipe = req.body;

    await global.prismaClient.recipe.update({
        where: {
            id: parseInt(req.params.id)
        },
        data: {
            name: recipe.name,
            desc: recipe.desc,
            ingredients: {
                connect: recipe.ingredients.map(ingredient => { return { id: ingredient.id } })
            }
        }
    });

    let apiResponse = new APIResponse(0, `Recipe ${req.params.id} was updated`);
    res.json(apiResponse);
});

router.delete('/:id', async (req, res) => {
    await global.prismaClient.recipe.delete({
        where: {
            id: parseInt(req.params.id)
        }
    });

    let apiResponse = new APIResponse(0, "Recipe deleted");
    res.json(apiResponse);
});

router.post('/search', async (req, res) => {
    // req.body = { ingredients:  number[] }
    const ingredients = req.body.ingredients;

    const query = ingredients.map(ingredient => {
        return {
            ingredients: {
                some: {
                    id: ingredient
                }
            }
        };
    });

    const recipes = await global.prismaClient.recipe.findMany({
        where: {
            OR: query,
        }
    });

    let apiResponse = new APIResponse(0, "Result fetched", recipes);
    res.json(apiResponse);
});

module.exports = router;