const Models = require("./../models");

class UsersController {

    static errorHandler(res, error) {
        const status = error.type && error.type === "ValidationError" ? 400 : 500,
            message = error.type && error.type === "ValidationError" ? error.message : "Internal Error";
        if(status === 500) console.log(error);
        res.status(status).send(message);
    }

    static responseHandler(res, data) {
        if(!data) return res.send();
        res.json(data);
    }

    static getUsers(req, res) {
        Models.users.findAll()
            .then( data => UsersController.responseHandler(res, data))
            .catch( err  => UsersController.errorHandler(res, err));
    }

    static createUser(req, res) {
        Models.users.insert(req.body)
            .then( () => UsersController.responseHandler(res))
            .catch( err  => UsersController.errorHandler(res, err));
    }

    static getUser(req, res) {
        const id = req.params.userId;
        Models.users.findById(id)
            .then( data => UsersController.responseHandler(res, data))
            .catch( err  => UsersController.errorHandler(res, err));
    }

    static updateUser(req, res) {
        const id = req.params.userId;
        Models.users.update(id, req.body)
            .then( () => UsersController.responseHandler(res))
            .catch( err  => UsersController.errorHandler(res, err));
    }

    static deleteUser(req, res) {
        const id = req.params.userId;
        Models.users.delete(id)
            .then( () => UsersController.responseHandler(res))
            .catch( err  => UsersController.errorHandler(res, err));
    }
}

module.exports = UsersController;