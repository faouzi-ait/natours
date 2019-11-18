exports.params = {
    db_url: process.env.DB_CONNECTION,
    db: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    },
    port: function() {
        return process.env.PORT || 4000;
    }
};
