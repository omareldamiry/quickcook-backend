const TableQueryModel = require("../../models/table-query");

module.exports = (model) => {
    const queryData = TableQueryModel.of(model);


    const tableQuery = {
        orderBy: {
            [queryData.sortField]: queryData.sortDirection
        },
        skip: queryData.pageNumber*queryData.pageSize,
        take: queryData.pageSize
    };

    return tableQuery;
    
};