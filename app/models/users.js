class UsersModel {
    constructor(db, validator) {
        this.db = db;
        this.validator = validator;
    }

    get collectionName() {
        return "users";
    }

    getSchema(type) {
        const schema = {
            type: "object",
            properties: {
                email: {
                    type: "string"
                },
                firstName: {
                    type: "string"
                },
                lastName: {
                    type: "string"
                },
                city: {
                    type: "string"
                },
                state: {
                    type: "string"
                }
            }
        };
        if(type === "insert") return {
            ...schema,
            required: [
                "email",
                "firstName",
                "lastName"
            ]
        };
        return schema;
    }

    errorHandler(type, message) {
        let error = new Error(message);
        error.type = type;
        return error;
    }

    findById(id) {
        if(!this.db.ObjectID.isValid(id)) return Promise.reject(this.errorHandler("ValidationError", `'${id}' is not valid ObjectId`) );
        return this.db.getCollection(this.collectionName)
            .then(collection => {
                const query = {
                    _id: this.db.ObjectID.createFromHexString(id)
                };
                return collection.findOne(query);
            });
    }

    findAll() {
        return this.db.getCollection(this.collectionName)
            .then(collection => collection.find({}).limit(100).toArray());
    }

    insert(data) {
        const validated = this.validator.validate(data, this.getSchema("insert"));
        if(!validated.isValid) return Promise.reject(this.errorHandler("ValidationError", validated.errors[0].message));
        return this.db.getCollection(this.collectionName)
            .then(collection => collection.insert(data));
    }

    update(id, data) {
        if(!this.db.ObjectID.isValid(id)) return Promise.reject(this.errorHandler("ValidationError", `'${id}' is not valid ObjectId`));
        if(Object.keys(data).length === 0) return Promise.reject(this.errorHandler("ValidationError", "Empty doc was passed"));
        const validated = this.validator.validate(data, this.getSchema("update"));
        if(!validated.isValid) return Promise.reject(this.errorHandler("ValidationError", validated.errors[0].message));
        const query = {
            _id: this.db.ObjectID.createFromHexString(id)
        };
        return this.db.getCollection(this.collectionName)
            .then(collection => collection.update(query, { "$set": data }));
    }

    delete(id) {
        if(!this.db.ObjectID.isValid(id)) return Promise.reject(this.errorHandler("ValidationError", `'${id}' is not valid ObjectId`));
        return this.db.getCollection(this.collectionName)
            .then(collection => {
                const query = {
                    _id: this.db.ObjectID.createFromHexString(id)
                };
                return collection.deleteOne(query);
            });
    }
}

module.exports = UsersModel;