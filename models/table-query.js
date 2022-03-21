module.exports = class TableQueryModel {
    filter;
    sortField;
    sortDirection;
    pageNumber;
    pageSize;

    constructor(filter, sortField, sortDirection, pageNumber, pageSize) {
        this.filter = filter;
        this.sortField = sortField;
        this.sortDirection = sortDirection;
        this.pageNumber = pageNumber;
        this.pageSize = pageSize;
    }

    static of(object) {
        return new TableQueryModel(object.filter, object.sortField, object.sortDirection, object.pageNumber, object.pageSize);
    }
}