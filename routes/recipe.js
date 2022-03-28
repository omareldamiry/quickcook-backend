const express = require('express');
const authenticate = require('../middlewares/authenticate');
const router = express.Router();
const APIResponse = require('../models/apiresponse');
const queryGenerator = require('../utilities/query generators/recipe-query-genrator');
const calculateRating = require('../utilities/calculate-ratings');
const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

router.use(express.json());

router.post('/', authenticate, async (req, res) => {
    // Expecting an object of type: RecipeQuery
    const queryBody = req.body.query;
    const generatedQuery = queryGenerator(queryBody);
    
    const queryResult = await prisma.recipe.findMany(generatedQuery);
    const queryResultLength = await prisma.recipe.count({
        where: generatedQuery.where,
    });

    let apiResponse = new APIResponse(0, `Successfully fetched page ${queryBody.pageNumber} of recipes`, {
        result: queryResult,
        length: queryResultLength
    });
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

router.put('/rate', async (req, res) => {
    // req.body = { rating: Rating }
    const newRating = req.body;
    const recipeRating = await prisma.recipe.findUnique({
        where: {
            id: parseInt(newRating.recipeId)
        },
        select: {
            rating: true,
            ratings: true,
        }
    });
    try {
    const recipe = await prisma.recipe.update({
        where: {
            id: parseInt(newRating.recipeId)
        },
        data: {
            rating: {
                set: parseFloat(calculateRating(recipeRating, newRating).toPrecision(2)),
            },
            ratings: {
                upsert: {
                    create: {
                        value: newRating.value,
                        comment: newRating.comment,
                        userId: parseInt(newRating.userId)
                    },
                    update: {
                        value: newRating.value,
                        comment: newRating.comment,
                        userId: parseInt(newRating.userId)
                    },
                    where: {
                        ratingRef: {
                            recipeId: parseInt(newRating.recipeId),
                            userId: parseInt(newRating.userId)
                        }
                    }
                }
            }
        }
    }); 
} catch (err) {
    console.log(err);
}

    let apiResponse = new APIResponse(0, "Updated recipe rating");
    res.json(apiResponse);
});

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

//! TO BE REMOVED
// @deprecated
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