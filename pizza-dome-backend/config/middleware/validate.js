const { validationResult } = require("express-validator");

// Runs after route-level validators.
// If any rule failed, responds with 422 + all error messages.
// Otherwise, passes control to the actual controller.
const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: "Validation failed.",
      errors: errors.array().map((e) => ({
        field: e.path,
        message: e.msg,
      })),
    });
  }

  next();
};

module.exports = validate;
