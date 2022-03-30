const superQueryGenerator = require('./query-generator');

module.exports = (model) => {
    const queryData = model;
    let query = superQueryGenerator(queryData);

    if(Object.keys(queryData['filter']).length !== 0) {
        const { id, name, ofType } = queryData.filter;

        query.where = {
            id: id || undefined,
            name: {
                contains: name || undefined,
            },
            type: ofType || undefined
        };

    }

    return query;

}