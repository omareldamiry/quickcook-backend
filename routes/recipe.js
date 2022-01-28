const express = require('express');
const authenticate = require('../middlewares/authenticate');
const router = express.Router();
const APIResponse = require('../models/apiresponse');

router.use(express.json());

router.post('/', authenticate, async (req, res) => {
    const allRecipes = await global.prismaClient.recipe.findMany();

    let apiResponse = new APIResponse(0, "Successfully fetched all recipes", allRecipes);
    res.json(apiResponse);
});

module.exports = router;