const Mongodb = require("./mongodb"),
    validator = require("./validator"),
    Users = require("./users");

let models = {
    users: null
};

module.exports = models;

module.exports.create = options => { 
    const mongodb = new Mongodb(options);
    models.users = new Users(mongodb, validator);
};