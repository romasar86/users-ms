const assert = require("chai").assert,
    sinon = require("sinon"),
    //proxyquire = require("proxyquire"),
    Users = require("./../../../app/models/users");


describe("Models/UsersModel", () => {
    describe("#findById()", () => {
        it("it should reject with error because of invalid id", (done) => {
            const id = "eiuwieu32487",
                dbMock = {
                    ObjectID: {
                        isValid : sinon.stub().returns(false)
                    }
                },
                users = new Users(dbMock);
            users.findById(id).then(done).catch( err => {
                assert.instanceOf(err, Error);
                done();
            });
        });

        it("it should resolve with proper data" , (done) => {
            const id = "testId",
                objId = `obj_${id}`,
                doc = { test: "doc" },
                collectionMock = {
                    findOne: sinon.stub().resolves(doc)
                },
                dbMock = {
                    ObjectID: {
                        isValid: sinon.stub().returns(true),
                        createFromHexString: sinon.stub().returns(objId)
                    },
                    getCollection: sinon.stub().resolves(collectionMock)
                },
                users = new Users(dbMock);
            users.findById(id).then(actualDoc => {
                assert.deepEqual(actualDoc, doc);
                assert.isTrue(dbMock.ObjectID.isValid.calledOnce);
                assert.isTrue(dbMock.ObjectID.isValid.calledWith(id));
                assert.isTrue(dbMock.getCollection.calledOnce);
                assert.isTrue(dbMock.getCollection.calledWith(users.collectionName));
                assert.isTrue(dbMock.ObjectID.createFromHexString.calledOnce);
                assert.isTrue(dbMock.ObjectID.createFromHexString.calledWith(id));
                assert.isTrue(collectionMock.findOne.calledOnce);
                assert.isTrue(collectionMock.findOne.calledWith({ _id: objId}));
                done();
            }).catch(done);
        });
    });

    describe("#delete()", () => {
        it("it should reject with error because of invalid id", (done) => {
            const id = "eiuwieu32487",
                dbMock = {
                    ObjectID: {
                        isValid : sinon.stub().returns(false)
                    }
                },
                users = new Users(dbMock);
            users.delete(id).then(done).catch( err => {
                assert.instanceOf(err, Error);
                done();
            });
        });

        it("it should resolve with proper data" , (done) => {
            const id = "testId",
                objId = `obj_${id}`,
                doc = { test: "doc" },
                collectionMock = {
                    deleteOne: sinon.stub().resolves(doc)
                },
                dbMock = {
                    ObjectID: {
                        isValid: sinon.stub().returns(true),
                        createFromHexString: sinon.stub().returns(objId)
                    },
                    getCollection: sinon.stub().resolves(collectionMock)
                },
                users = new Users(dbMock);
            users.delete(id).then(actualDoc => {
                assert.deepEqual(actualDoc, doc);
                assert.isTrue(dbMock.ObjectID.isValid.calledOnce);
                assert.isTrue(dbMock.ObjectID.isValid.calledWith(id));
                assert.isTrue(dbMock.getCollection.calledOnce);
                assert.isTrue(dbMock.getCollection.calledWith(users.collectionName));
                assert.isTrue(dbMock.ObjectID.createFromHexString.calledOnce);
                assert.isTrue(dbMock.ObjectID.createFromHexString.calledWith(id));
                assert.isTrue(collectionMock.deleteOne.calledOnce);
                assert.isTrue(collectionMock.deleteOne.calledWith({ _id: objId}));
                done();
            }).catch(done);
        });
    });

    describe("#findAll()", () => {
        it("it should reject with error", (done) => {
            const dbMock = {
                    getCollection: sinon.stub().rejects()
                },
                users = new Users(dbMock);
            users.findAll().then(done).catch( err => {
                assert.instanceOf(err, Error);
                done();
            });
        });

        it("it should resolve with proper data", (done) => {
            const expectedData = [ { test: "test" } ],
                cursorMock = {};
            cursorMock.limit = sinon.stub().returns(cursorMock);
            cursorMock.toArray = sinon.stub().returns(expectedData);
            const collectionMock = {
                    find: sinon.stub().returns(cursorMock)
                },
                dbMock = {
                    getCollection: sinon.stub().resolves(collectionMock)
                },
                users = new Users(dbMock);
            users.findAll().then( data => {
                assert.deepEqual(data, expectedData);
                assert.isTrue(dbMock.getCollection.calledOnce);
                assert.isTrue(dbMock.getCollection.calledWith(users.collectionName));
                assert.isTrue(collectionMock.find.calledOnce);
                assert.isTrue(collectionMock.find.calledWith({}));
                assert.isTrue(cursorMock.limit.calledOnce);
                assert.isTrue(cursorMock.toArray.calledOnce);
                done();
            }).catch(done);
        });
    });

    describe("#errorHandler()", () => {
        it("it should return error instance", () => {
            const users = new Users(),
                type = "testType",
                message = "testMessage",
                err = users.errorHandler(type, message);

            assert.instanceOf(err, Error);
            assert.equal(err.message, message);
            assert.equal(err.type, type);
        });
    });
    
    describe("#insert()", () => {
        it("it should reject with validation error", (done) => {
            const testErrorMessage = "testError",
                validationData = {
                    isValid: false,
                    errors: [{message: testErrorMessage}]
                },
                validatorMock = {
                    validate: sinon.stub().returns(validationData)
                },
                testDoc = { test: "doc" },
                users = new Users({}, validatorMock);
            users.insert(testDoc).then(done).catch(err => {
                assert.instanceOf(err, Error);
                assert.equal(err.type, "ValidationError");
                assert.isTrue(validatorMock.validate.calledOnce);
                assert.isTrue(validatorMock.validate.calledWith(testDoc));
                done();
            });
        });

        it("it should resolve properly", (done) => {
            const validatorMock = {
                    validate: sinon.stub().returns({isValid: true})
                },
                collectionMock = {
                    insert: sinon.stub().resolves()
                },
                dbMock = {
                    getCollection: sinon.stub().resolves(collectionMock)
                },
                testDoc = { test: "doc" },
                users = new Users(dbMock, validatorMock);
            users.insert(testDoc).then(() => {
                assert.isTrue(dbMock.getCollection.calledOnce);
                assert.isTrue(dbMock.getCollection.calledWith(users.collectionName));
                assert.isTrue(collectionMock.insert.calledOnce);
                assert.isTrue(collectionMock.insert.calledWith(testDoc));
                done();
            }).catch(done);
        });
    });

    describe("#update()", () => {
        it("it should reject with validation error -- id is not ObjectID", (done) => {
            const dbMock = {
                    ObjectID: {
                        isValid: sinon.stub().returns(false)
                    }
                },
                id = "testID",
                testDoc = { test: "doc" },
                users = new Users(dbMock);
            users.update(id, testDoc).then(done).catch(err => {
                assert.instanceOf(err, Error);
                assert.isTrue(dbMock.ObjectID.isValid.calledOnce);
                assert.isTrue(dbMock.ObjectID.isValid.calledWith(id));
                assert.equal(err.type, "ValidationError");
                done();
            });
        });

        it("it should reject with validation error -- data is empty", (done) => {
            const dbMock = {
                    ObjectID: {
                        isValid: sinon.stub().returns(true)
                    }
                },
                id = "testID",
                testDoc = {},
                users = new Users(dbMock);
            users.update(id, testDoc).then(done).catch(err => {
                assert.instanceOf(err, Error);
                assert.equal(err.type, "ValidationError");
                assert.equal(err.message, "Empty doc was passed");
                done();
            });
        });

        it("it should reject with validation error -- doc is not valid", (done) => {
            const testErrorMessage = "testError",
                validationData = {
                    isValid: false,
                    errors: [{message: testErrorMessage}]
                },
                validatorMock = {
                    validate: sinon.stub().returns(validationData)
                },
                dbMock = {
                    ObjectID: {
                        isValid: sinon.stub().returns(true)
                    }
                },
                id = "testID",
                testDoc = { test: "doc" },
                users = new Users(dbMock, validatorMock);
            users.update(id, testDoc).then(done).catch(err => {
                assert.instanceOf(err, Error);
                assert.equal(err.type, "ValidationError");
                assert.isTrue(validatorMock.validate.calledOnce);
                assert.isTrue(validatorMock.validate.calledWith(testDoc));
                done();
            });
        });
        
        it("it should resolve properly", (done) => {
            const validatorMock = {
                    validate: sinon.stub().returns({isValid: true})
                },
                collectionMock = {
                    update: sinon.stub().resolves()
                },
                id = "testId",
                objId = "testObjectID",
                dbMock = {
                    ObjectID: {
                        isValid: sinon.stub().returns(true),
                        createFromHexString: sinon.stub().returns(objId)
                    },
                    getCollection: sinon.stub().resolves(collectionMock)
                },
                testDoc = { test: "doc" },
                users = new Users(dbMock, validatorMock);
            users.update(id,testDoc).then(() => {
                assert.isTrue(dbMock.getCollection.calledOnce);
                assert.isTrue(dbMock.getCollection.calledWith(users.collectionName));
                assert.isTrue(dbMock.ObjectID.createFromHexString.calledOnce);
                assert.isTrue(dbMock.ObjectID.createFromHexString.calledWith(id));
                assert.isTrue(collectionMock.update.calledOnce);
                assert.isTrue(collectionMock.update.calledWith({ _id: objId }, { "$set": testDoc }));
                done();
            }).catch(done);
        });
    });


});

