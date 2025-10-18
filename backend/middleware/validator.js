const { body, param, validationResult } = require('express-validator');

const userValidationRules = [
  body('username').trim().isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').optional().isIn(['user', 'admin']).withMessage('Role must be either user or admin'),
  body('profile.name').optional().trim().isLength({ min: 1 }).withMessage('Name is required')
];

const testCaseValidationRules = [
  body('input').notEmpty().withMessage('Input is required'),
  body('expectedOutput').notEmpty().withMessage('Expected output is required'),
  body('isHidden').optional().isBoolean().withMessage('isHidden must be a boolean')
];

const submissionValidationRules = [
  body('challengeId').isMongoId().withMessage('Invalid challenge ID'),
  body('code').notEmpty().withMessage('Code is required'),
  body('language').isIn(['python', 'javascript', 'java', 'cpp']).withMessage('Invalid language')
];

const contestValidationRules = [
  body('name').notEmpty().withMessage('Contest name is required'),
  body('startTime').isISO8601().withMessage('Valid start time is required'),
  body('endTime').isISO8601().withMessage('Valid end time is required'),
  body('description').optional().isString()
];

const idValidationRules = [
  param('id').isMongoId().withMessage('Invalid ID format')
];

const validate = (rules) => {
  return async (req, res, next) => {
    await Promise.all(rules.map(rule => rule.run(req)));
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }
    
    next();
  };
};

module.exports = { 
  validate, 
  userValidationRules, 
  testCaseValidationRules,
  submissionValidationRules,
  contestValidationRules,
  idValidationRules 
};
