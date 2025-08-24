// routes/recipesRoutes.js (CommonJS + correct model)
const express = require('express');
const Recipes = require('../models/recipes'); // your schema exports model name 'Recipes'

const router = express.Router();

/**
 * GET /api/dishes
 * List all dishes
 */
router.get('/', async (_req, res) => {
  try {
    const dishes = await Recipes.find();
    res.json(dishes);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch dishes', error: error.message });
  }
});

/**
 * GET /api/dishes/:name
 * Get a dish by name (case-insensitive)
 */
router.get('/:name', async (req, res) => {
  const { name } = req.params;
  try {
    const dish = await Recipes.findOne({ name: new RegExp(`^${name}$`, 'i') });
    if (!dish) return res.status(404).json({ message: 'Dish not found.' });
    res.json(dish);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch dish', error: error.message });
  }
});

/**
 * POST /api/dishes
 * Create a dish
 * Body: { name, ingredients:[String], preparationSteps:[String], cookingTime:Number, origin:String, serving:Number }
 */
router.post('/', async (req, res) => {
  const { name, ingredients, preparationSteps, cookingTime, origin, serving } = req.body;

  try {
    const existing = await Recipes.findOne({ name });
    if (existing) return res.status(409).json({ message: 'Dish already exists' });

    const newDish = new Recipes({ name, ingredients, preparationSteps, cookingTime, origin, serving });
    await newDish.save();
    res.status(201).json(newDish);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add dish', error: error.message });
  }
});

/**
 * PUT /api/dishes/:id
 * Update a dish by id
 */
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const newData = req.body;
  try {
    const updated = await Recipes.findByIdAndUpdate(id, newData, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ message: 'No dish found.' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update dish', error: error.message });
  }
});

/**
 * DELETE /api/dishes/:id
 */
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Recipes.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'No dish found.' });
    res.json({ message: 'Deleted dish successfully', deletedDish: deleted });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete dish', error: error.message });
  }
});

module.exports = router;
