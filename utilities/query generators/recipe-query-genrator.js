const superQueryGenerator = require('./query-generator');

module.exports = (model) => {
    const queryData = model;
    let query = superQueryGenerator(queryData);
    
    query.include = {
        ingredients: true,
        ratings: true,
    };
    
    if (Object.keys(queryData['filter']).length !== 0) {
        
        const ingredientsQuery = queryData.filter.ingredients?.map(ingredient => {
            return {
                ingredients: {
                    some: {
                        id: ingredient.id
                    }
                }
            };
        });
        
        query.where = {
            id: parseInt(queryData.filter.id) || undefined,
            name: {
                contains: queryData.filter.name || undefined,
            },
            OR: ingredientsQuery?.length ? ingredientsQuery : undefined,
            createdAt: {
                gte: queryData.filter.createdAt || undefined
            }
        };
    }

    return query;

}