const mongoose = require ('mongoose')
const recipeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },

    ingredients: {
        type: [String],
        required: true
    },

    preparationSteps: {
        type: [String],
        required: true
    },

    cookingTime: {
        type: Number,
        required: true
    },

    origin: {
        type: String,
        required: true
    },

    serving: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model('Recipes' , recipeSchema)