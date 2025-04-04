import { validationResult } from 'express-validator';
import Question from '../models/question.model.js';
import Category from '../models/category.model.js'; // Assuming you have a Category model
import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';

// Controller to add a new question
const addQuestion = asyncHandler(async (req, res) => {
    const questionsData = req.body; // This could be a single question or an array of questions.
    try {
        console.log(questionsData.questions);

        const isBulk = Array.isArray(questionsData.questions);

        if (isBulk) {
            const questionsToInsert = [];

            for (let questionData of questionsData.questions) {
                const { title, options, correctAnswerIndex, explanation, category_id, level } = questionData;

                const categoryExists = await Category.findById(category_id);
                if (!categoryExists) {
                    return res.status(400).json({ message: `Invalid category ID for question: ${title}` });
                }

                const question = new Question({
                    title,
                    options,
                    correctAnswerIndex,
                    explanation,
                    category_id,
                    level,
                });

                questionsToInsert.push(question);
            }

            const savedQuestions = await Question.insertMany(questionsToInsert);
            return res.status(201).json({ status: true, message: 'Questions added successfully', questions: savedQuestions });
        } else {
            const { title, options, correctAnswerIndex, explanation, category_id, level } = questionsData;

            const categoryExists = await Category.findById(category_id);
            if (!categoryExists) {
                return res.status(400).json({ status: false, message: 'Invalid category ID' });
            }

            const question = new Question({
                title,
                options,
                correctAnswerIndex,
                explanation,
                category_id,
                level,
            });

            const savedQuestion = await question.save();
            return res.status(201).json({ status: true, message: 'Question added successfully', question: savedQuestion });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: 'Internal Server Error', error: error.message });
    }
});

const getQuestions = asyncHandler(async (req, res) => {
    const { category_id } = req.params;
    const categoryExists = await Category.findById(category_id);
    if (!categoryExists) {
        return res.status(400).json({ message: 'Invalid category ID' });
    }
    const questions = await Question.aggregate([
        { $match: { category_id: new mongoose.Types.ObjectId(category_id) } },
        { $sample: { size: 15 } },
        {
            $project: {
                correctAnswerIndex: 0,
            },
        },
    ]);
    if (questions.length === 0) {
        return res.status(404).json({ status: false, category_id, message: "No questions found for this category" });
    }
    return res.status(200).json({ status: true, message: "Questions Are Ready", data: questions });
});

const getQuestionsAll = asyncHandler(async (req, res) => {
    const { category_id } = req.params;
    const categoryExists = await Category.findById(category_id);
    console.log(categoryExists);
    if (!categoryExists) {
        return res.status(400).json({ message: 'Invalid category ID' });
    }
    const questions = await Question.find({ category_id });

    if (questions.length === 0) {
        return res.status(404).json({ status: false, category_id, message: "No questions found for this category" });
    }

    return res.status(200).json({ status: true, message: "Questions Are Ready", data: questions });
});

// Export using ES module syntax
export { addQuestion, getQuestions, getQuestionsAll };
