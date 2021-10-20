exports.getQueryOptions = (query) => {

    const limit = parseInt(query.limit) || 10;
    const offset = parseInt(query.offset) || 0;
    var orderBy = query.order;

    if (orderBy === undefined) {
        return { limit: limit, offset: offset }
    }

    var orderType = 'ASC';
    if (orderBy && orderBy.startsWith('-')) {
        orderType = 'DESC';
        orderBy = order.substring(1);
    }

    return { limit: limit, offset: offset, order: [[ orderBy, orderType ]] }
};
