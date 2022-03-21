const superQueryGenerator = require('./query-generator');

module.exports = (model) => {
    const queryData = model;
    let query = superQueryGenerator(queryData);

    if(Object.keys(queryData['filter']).length !== 0) {

        query.where = {
            name: {
                contains: queryData.filter.name || undefined,
            },
            type: queryData.filter.ofType || undefined
        };

    }

    return query;

}