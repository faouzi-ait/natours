exports.params = {
    db_url: process.env.DB_CONNECTION,
    db: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    },
    port: function() {
        return process.env.PORT || 4000;
    },
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRE: process.env.JWT_EXPIRE
};
