const express = require("express"),
    app = express(),
    config = require("./app/config"),
    bodyParser = require("body-parser"),
    routes = require("./app/routes"),
    Models = require("./app/models");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

Models.create(config.mongodb);

routes(app);

app.listen(config.port, () => {
    console.log(config.name, "server was started on port - " + config.port);
});