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

exports.oauth = {
    type: 'oauth2',
    user: process.env.user,
    clientId: process.env.clientId,
    clientSecret: process.env.clientSecret,
    refreshToken:
        '1//0473R-aoau6JSCgYIARAAGAQSNwF-L9IrWQn90L6gAY_pyWEg7OX2VNI7kX3rqAA4APmZPH1I1rh7kx7bNn3H-6Kuqqu0dnmEKx0'
};
