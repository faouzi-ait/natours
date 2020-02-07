exports.paginate = model => {
    return async (req, res, next) => {
        const query = { ...req.query };
        const excludeFields = ['page', 'sort', 'limit', 'fields'];

        excludeFields.forEach(field => delete query[field]);

        // 2 ADVANCED FILTERING TO USE GT, LT, GTE, LTE OPERATORS
        let queryStr = JSON.stringify(query);
        queryStr = queryStr.replace(
            /\b(gte|gt|lte|lt)\b/g,
            match => `$${match}`
        );

        let q = model.find(JSON.parse(queryStr));

        // 3 SORTING
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            q = q.sort(sortBy);
        } else {
            q = q.sort('-createdAt');
        }

        // 4 FIELD LIMITING: ONLY DISPLAY THE SPECIFIED FIELDS
        if (req.query.fields) {
            const field = req.query.fields.split(',').join(' ');
            q = q.select(field);
        } else {
            q = q.select('-__v');
        }

        // 5 PAGINATION
        const page = req.query.page * 1 || 1;
        const limit = req.query.limit * 1 || 100;
        const skip = (page - 1) * limit;

        q = q.skip(skip).limit(limit);

        if (req.query.page) {
            const numTour = await model.countDocuments();
            if (skip >= numTour) throw new Error('The page doesnt exist');
        }

        // EXECUTE QUERY
        const tours = await q;
        const count = await q.countDocuments();

        res.status(200).json({
            status: 'success',
            number_of_records: count,
            current_page: req.query.page * 1 || 1,
            total_pages: Math.ceil(count / limit),
            timestamp: `${req.requestedDate} - ${req.requestedTime}`,
            data: { tours }
        });
    };
};
