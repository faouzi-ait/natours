const sort = (req, q) => {
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        q = q.sort(sortBy);
    } else {
        q = q.sort('-createdAt');
    }
    return q;
};

const fields = (req, q) => {
    if (req.query.fields) {
        const field = req.query.fields.split(',').join(' ');
        q = q.select(field);
    } else {
        q = q.select('-__v');
    }
    return q;
};

const pageExist = async (req, model) => {
    if (req.query.page) {
        const numTour = await model.countDocuments();
        if (skip >= numTour) throw new Error('The page doesnt exist');
    }
};

const pagination = req => {
    let page = req.query.page * 1 || 1;
    let limit = req.query.limit * 1 || 100;
    let skip = (page - 1) * limit;

    return {
        limit,
        skip
    };
};

const queryString = query => {
    query = query.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
    return query;
};

exports.paginate = model => {
    return async (req, res, next) => {
        const query = { ...req.query };
        ['page', 'sort', 'limit', 'fields'].forEach(
            field => delete query[field]
        );

        // 2 ADVANCED FILTERING TO USE GT, LT, GTE, LTE OPERATORS
        let q = model.find(JSON.parse(queryString(JSON.stringify(query))));

        sort(req, q);
        fields(req, q);

        const limit = pagination(req).limit;
        const skip = pagination(req).skip;
        q = q.skip(skip).limit(limit);

        pageExist(req, model);

        // EXECUTE QUERY
        const tours = await q;
        const count = await q.countDocuments();

        res.status(200).json({
            status: `success, timestamp: ${req.requestedDate} - ${req.requestedTime}`,
            number_of_records: count,
            current_page: req.query.page * 1 || 1,
            total_pages: Math.ceil(count / limit),
            data: { tours }
        });
    };
};
