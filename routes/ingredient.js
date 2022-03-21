const express = require('express');
const router = express.Router();
const APIResponse = require('../models/apiresponse');
const { PrismaClient } = require('@prisma/client');
const queryGenerator = require('../utilities/query generators/ingredient-query-generator');
const prisma = new PrismaClient();

router.use(express.json());

router.get('/', async (req, res) => {
    const allIngredients = await global.prismaClient.ingredient.findMany();

    let apiResponse = new APIResponse(0, "Successfully fetched all ingredients", allIngredients);
    res.json(apiResponse);
});
// TODO: Internationalize this query structure & add a 'count' operation before pagination.
router.post('/', async (req, res) => {
    // query: IngredientQuery
    const queryBody = req.body;
    const generatedQuery = queryGenerator(queryBody);

    const queryResult = await prisma.ingredient.findMany(generatedQuery);
    const queryResultLength = await prisma.ingredient.aggregate({
        where: generatedQuery.where,
        _count: true
    });

    let apiResponse = new APIResponse(0, `Fetched page ${queryBody.pageNumber} of ingredients successfully`, {
        result: queryResult,
        length: queryResultLength._count,
    });

    res.json(apiResponse);
});

router.post('/ingredient', async (req, res) => {
    const ingredient = req.body;

    await global.prismaClient.ingredient.create({
        data: ingredient
    });

    let apiResponse = new APIResponse(0, "Ingredient created");
    res.json(apiResponse);
});

router.put('/:id', async (req, res) => {
    const ingredientId = req.params.id;
    const ingredient = req.body;

    await global.prismaClient.ingredient.update({
        where: {
            id: Number(ingredientId)
        },
        data: ingredient
    });

    let apiResponse = new APIResponse(0, "Ingredient updated");
    res.json(apiResponse);
});

router.delete('/:id', async (req, res) => {
    const ingredientId = req.params.id;

    await global.prismaClient.ingredient.delete({
        where: {
            id: Number(ingredientId)
        }
    });

    let apiResponse = new APIResponse(0, "Ingredient deleted");
    res.json(apiResponse);
});

module.exports = router;