const express = require("express");
const router = express.Router();
const { runCode, submitCode, testGamification } = require("../controllers/Submission");
const { validate, submissionValidationRules } = require("../middleware/validator");
const auth = require("../middleware/auth");

router.post("/run", auth, runCode);
router.post("/", auth, validate(submissionValidationRules), submitCode);
router.post("/test-gamification", testGamification);

module.exports = router;
