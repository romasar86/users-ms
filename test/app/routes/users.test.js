const assert = require("chai").assert,
    sinon = require("sinon"),
    proxyquire = require("proxyquire");

describe("Routes/Users", () => {
    describe("module.exports", () => {
        it("it should add routes to app", () => {
            const usersControllerMock = {
                    getUsers: "getUsers",
                    createUser: "createUser",
                    getUser: "getUser",
                    updateUser: "updateUser",
                    deleteUser: "deleteUser"
                },
                users = proxyquire("./../../../app/routes/users", {
                    "./../controllers/users": usersControllerMock
                }),
                routeMock = {},
                appMock = {
                    route: sinon.stub().returns(routeMock)
                };
            routeMock.get = sinon.stub().returns(routeMock);
            routeMock.post = sinon.stub().returns(routeMock);
            routeMock.put = sinon.stub().returns(routeMock);
            routeMock.delete = sinon.stub().returns(routeMock);
            users(appMock);
            assert.isTrue(appMock.route.calledTwice);
            assert.isTrue(appMock.route.calledWith("/users"));
            assert.isTrue(appMock.route.calledWith("/users/:userId"));
            assert.isTrue(routeMock.get.calledTwice);
            assert.isTrue(routeMock.get.calledWith(usersControllerMock.getUsers));
            assert.isTrue(routeMock.get.calledWith(usersControllerMock.getUser));
            assert.isTrue(routeMock.post.calledOnce);
            assert.isTrue(routeMock.post.calledWith(usersControllerMock.createUser));
            assert.isTrue(routeMock.put.calledOnce);
            assert.isTrue(routeMock.put.calledWith(usersControllerMock.updateUser));
            assert.isTrue(routeMock.delete.calledOnce);
            assert.isTrue(routeMock.delete.calledWith(usersControllerMock.deleteUser));
        });
    });
});