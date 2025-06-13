import express from 'express';
import Dish from '../models/dishSchema.js';

const router = express.Router();

router.post('/api/dishes', async (req, res) => {
    const { name, ingredients, preparationSteps, cookingTime, origin, spiceLevel } = req.body;

    try {
        const existingDish = await Dish.findOne({ name });
        if (existingDish) {
            return res.status(409).json({ message: "Dish already exists" });
        }

        const newDish = new Dish({ name, ingredients, preparationSteps, cookingTime, origin, spiceLevel });
        await newDish.save();
        res.status(201).json(newDish);
    } catch (error) {
        res.status(500).json({ message: "Failed to add dish", error });
    }
});


router.get('/api/dishes', async (req, res) => {
    try {
        const dishes = await Dish.find();
        res.json(dishes);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch dishes", error});
    }
});


router.get('/api/dishes/:name', async (req, res) => {
    const {name} = req.params;
    try {
        const dish = await Dish.findOne({name: new RegExp('^' + name + '$', 'i')});
        if (!dish) {
            return res.status(404).json({message: 'Dish not found.'});
        }
        res.json(dish);
    } catch (error) {
        res.status(500).json({message: 'Failed to fetch dish', error});
    }
});


router.put('/api/dishes/:id', async (req, res) => {
    const { id } = req.params;
    const newData = req.body;

    try {
        const newDish = await Dish.findByIdAndUpdate(id, newData, {
            new: true,
            runValidators: true,
        });

        if (!newDish) {
            return res.status(404).json({ message: 'No dish found.' });
        }

        res.json(newDish);
    } catch (error) {
        console.error('Error updating dish:', error); 
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});


router.delete('/api/dishes/:id', async (req, res) => {
    const {id} = req.params;

    try {
        const deletedDish = await Dish.findByIdAndDelete(id);

        if (!deletedDish) {
            return res.status(404).json({message: 'No dish found.'});
        }
        res.json({message: 'Deleted dish successfully', deletedDish: deletedDish});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});


export default router;