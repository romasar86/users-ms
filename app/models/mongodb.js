const MongoClient = require("mongodb").MongoClient,
    ObjectID = require("mongodb").ObjectID;

let db = null;

class Mongodb {
    constructor(options) {
        this.options = options;
    }

    connect() {
        const url = `mongodb://${this.options.host}:${this.options.port}`;
        return MongoClient.connect(url)
            .then( client => client.db(this.options.dbName));
    }

    get ObjectID() {
        return ObjectID;
    }

    getCollection(collectionName) {
        if(db) return Promise.resolve(db.collection(collectionName));
        return this.connect().then(newDb => {
            db = newDb;
            return db.collection(collectionName);
        });
    }

    



}

module.exports = Mongodb;