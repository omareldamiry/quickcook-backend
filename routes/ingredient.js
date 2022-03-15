const express = require('express');
const router = express.Router();
const APIResponse = require('../models/apiresponse');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.use(express.json());

router.get('/', async (req, res) => {
    const allIngredients = await global.prismaClient.ingredient.findMany();

    let apiResponse = new APIResponse(0, "Successfully fetched all ingredients", allIngredients);
    res.json(apiResponse);
});

router.post('/', async (req, res) => {
    // query: IngredientQuery
    const query = req.body;

    const queryResult = await prisma.ingredient.findMany({
        where: {
            name: {
                contains: query.name
            },
            type: query.ofType,
        },
        orderBy: {
            [query.sortField]: query.sortDirection
        },
        skip: query.pageSize*query.pageNumber,
        take: query.pageSize,
    });

    let apiResponse = new APIResponse(0, `Fetched page ${query.pageNumber} of ingredients successfully`, {
        result: queryResult,
        length: query.pageSize,
    });

    res.json(apiResponse);

    console.log(query);
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