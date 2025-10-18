const express = require("express");
const router = express.Router();
const { getTestCaseResults } = require("../controllers/testcaseresult");
const { validate, idValidationRules } = require("../middleware/validator");
const auth = require("../middleware/auth");

router.get("/:id", auth, validate(idValidationRules), getTestCaseResults);

module.exports = router;