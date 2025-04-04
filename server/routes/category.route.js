import { Router } from 'express';
import { getCategories, getCategory } from '../controllers/category.controller.js';

const router = Router();

router.get("/", getCategories);
router.get("/:category_id", getCategory);

export default router;