const Validator = require("jsonschema").Validator,
    validator = new Validator();

exports.validate = (data, schema) => {
    const validationInfo = validator.validate(data, schema);
    if(validationInfo.valid) return { isValid: true };
    return {
        isValid: false,
        errors: validationInfo.errors
    };
};