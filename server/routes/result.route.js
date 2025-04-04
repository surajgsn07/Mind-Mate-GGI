import express from 'express';
import { check } from 'express-validator';
import { submitQuizResults, getUserResults, getResultAnalysis } from '../controllers/result.controller.js';
import { validate } from '../middlewares/validate.js';
import { verifyAuth } from '../middlewares/auth.js';
const router = express.Router();


// Middleware to validate request body
const validateQuizResults = [
    check('category_id').not().isEmpty().withMessage('Category ID is required'),
    check('answers').isArray().withMessage('Answers should be an array of objects'),
    check('answers.*.question_id').isMongoId().not().isEmpty().withMessage('Question ID is required'),
    check('answers.*.user_answer').isNumeric().withMessage('User answer must be a number')
];



// POST route for submitting quiz results
router.post('/submit-quiz', verifyAuth, validateQuizResults, validate, submitQuizResults);
router.get('/user-results', verifyAuth, getUserResults);
router.get('/result-analysis/:result_id', verifyAuth, getResultAnalysis);
export default router;
