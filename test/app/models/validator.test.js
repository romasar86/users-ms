const assert = require("chai").assert,
    validator = require("./../../../app/models/validator");

describe("Models/Validator", () => {
    describe("#validate()", () => {
        it("it should return isValid equal true", () => {
            const data = 4,
                schema = { "type": "number" },
                result = validator.validate(data, schema);
            assert.isTrue(result.isValid);
        });

        it("it should return isValid equal false and errors", () => {
            const data = "test",
                schema = { "type": "number" },
                result = validator.validate(data, schema);
            assert.isFalse(result.isValid);
            assert.exists(result.errors);
        });
    });
});