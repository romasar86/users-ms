const users = require("./../controllers/users");

module.exports = app => {
    app.route("/users")
        .get(users.getUsers)
        .post(users.createUser);
        
    app.route("/users/:userId")
        .get(users.getUser)
        .put(users.updateUser)
        .delete(users.deleteUser);
};