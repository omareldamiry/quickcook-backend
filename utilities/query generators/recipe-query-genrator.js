const superQueryGenerator = require('./query-generator');

module.exports = (model) => {
    const queryData = model;
    let query = superQueryGenerator(queryData);

    query.include = {
        ingredients: true,
        ratings: true,
    };

    if (Object.keys(queryData['filter']).length !== 0) {
        const { id, name, ingredients, createdAt } = queryData.filter;

        const ingredientsQuery = {
            some: {
                id: {
                    in: ingredients && ingredients.length? ingredients.map(ingredient => ingredient.id) : undefined
                }
            }
        };

        console.log(queryData);

        query.where = {
            id: {
                in: id? id.map(id => parseInt(id)) : undefined
            },
            name: {
                contains: name || undefined,
            },
            ingredients: ingredientsQuery || undefined,
            createdAt: {
                gte: createdAt || undefined
            }
        };
    }

    return query;

}