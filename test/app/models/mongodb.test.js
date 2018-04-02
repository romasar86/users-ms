const assert = require("chai").assert,
    sinon = require("sinon"),
    proxyquire = require("proxyquire"),
    Mongodb = require("./../../../app/models/mongodb");

describe("Models/Mongodb", () => {
    describe("#constructor()", () => {
        it("it should set proper options object", () => {
            const options = { test: "test" },
                mongodb = new Mongodb(options);
            assert.deepEqual(mongodb.options, options);
        });
    });

    describe("#getCollection()", () => {
        it("it should reject with error", (done) => {
            const mongodb = new Mongodb();
            sinon.stub(mongodb, "connect").rejects();
            mongodb.getCollection().then(done).catch( err => {
                assert.instanceOf(err, Error);
                done();
            });
        });

        it("it should resolve with collection object", (done) => {
            const collectionObj = { test: "collectionObj" },
                collectionName = "test",
                dbMock = {
                    collection: sinon.stub().returns(collectionObj)
                },
                mongodb = new Mongodb();
            sinon.stub(mongodb, "connect").resolves(dbMock);
            mongodb.getCollection(collectionName)
                .then(() => mongodb.getCollection(collectionName))
                .then((actualCollectionObj) => {
                    assert.deepEqual(actualCollectionObj, collectionObj);
                    assert.isTrue(mongodb.connect.calledOnce);
                    assert.isTrue(dbMock.collection.calledTwice);
                    assert.isTrue(dbMock.collection.calledWith(collectionName));
                    done();
                })
                .catch(done);
        });
    });

    describe("#ObjectID()", () => {
        it("it should return proper object", () => {
            const ObjectIDMock = { test: "ObjectIDMock" }, 
                Mongodb = proxyquire("./../../../app/models/mongodb", {
                    "mongodb": {
                        ObjectID: ObjectIDMock,
                        MongoClient: {}
                    }
                }),
                mongodb = new Mongodb(),
                actualObjectID = mongodb.ObjectID;
            assert.deepEqual(actualObjectID, ObjectIDMock);
        });
    });

    describe("#connect()", () => {
        it("it should resolve with db object", (done) => {
            const options = {
                    host: "test_host",
                    port: "test_port",
                    dbName: "test_dbName"
                },  
                dbObj = { test: "dbObj" },
                clientMock = {
                    db: sinon.stub().returns(dbObj)
                },
                MongoClientMock = {
                    connect: sinon.stub().resolves(clientMock)
                },
                Mongodb = proxyquire("./../../../app/models/mongodb", {
                    "mongodb": {
                        ObjectID: {},
                        MongoClient: MongoClientMock
                    }
                }),
                mongodb = new Mongodb(options);
            mongodb.connect().then((actualDbObj) => {
                assert.deepEqual(actualDbObj, dbObj);
                assert.isTrue(MongoClientMock.connect.calledOnce);
                assert.isTrue(MongoClientMock.connect.calledWith(`mongodb://${options.host}:${options.port}`));
                assert.isTrue(clientMock.db.calledOnce);
                assert.isTrue(clientMock.db.calledWith(options.dbName));
                done();
            }).catch(done);
        });

        it("it should reject with error", (done) => {
            const MongoClientMock = {
                    connect: sinon.stub().rejects()
                },
                Mongodb = proxyquire("./../../../app/models/mongodb", {
                    "mongodb": {
                        ObjectID: {},
                        MongoClient: MongoClientMock
                    }
                }),
                mongodb = new Mongodb({});
            mongodb.connect().then(done).catch(err => {
                assert.instanceOf(err, Error);
                done();
            });
        });
    });
});