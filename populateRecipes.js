// populateRecipes.js
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./db');        // uses process.env.CONNECTION_URL
const Dish = require('./models/recipes'); // your existing model exports 'Recipes'

const seed = [
  {
    name: "Qabli Pulao (Family Favorite)",
    ingredients: ["Rice", "Beef", "Carrots", "Raisins", "Yogurt", "Spices", "Salt"],
    preparationSteps: [
      "Marinate beef", "Cook beef until tender",
      "Parboil rice", "Layer with beef, carrots & raisins", "Steam"
    ],
    cookingTime: 90,
    origin: "Afghan/Pakistani",
    spiceLevel: "medium"
  },
  {
    name: "Chicken Biryani",
    ingredients: ["Basmati Rice", "Chicken", "Onion", "Tomato", "Green Chili", "Biryani Masala"],
    preparationSteps: ["Fry onions", "Cook chicken with spices", "Layer with rice", "Steam (dum)"],
    cookingTime: 75,
    origin: "Pakistani",
    spiceLevel: "hot"
  },
  {
    name: "Pasta Aglio e Olio",
    ingredients: ["Spaghetti", "Garlic", "Olive Oil", "Chili Flakes", "Parsley", "Salt"],
    preparationSteps: ["Boil pasta", "Infuse oil with garlic", "Toss with pasta & chili", "Finish with parsley"],
    cookingTime: 20,
    origin: "Italian",
    spiceLevel: "mild"
  },
  {
    name: "Veggie Stir-Fry",
    ingredients: ["Broccoli", "Bell Peppers", "Carrot", "Soy Sauce", "Ginger", "Garlic"],
    preparationSteps: ["Prep veggies", "Stir-fry aromatics", "Add veggies", "Season & toss"],
    cookingTime: 15,
    origin: "Fusion",
    spiceLevel: "medium"
  },
  {
    name: "Shakshuka",
    ingredients: ["Eggs", "Tomatoes", "Onion", "Bell Pepper", "Cumin", "Paprika"],
    preparationSteps: ["Cook sauce", "Make wells", "Add eggs", "Cover & set whites"],
    cookingTime: 30,
    origin: "Middle Eastern",
    spiceLevel: "mild"
  }
];

(async () => {
  try {
    await connectDB();

    const count = await Dish.countDocuments();
    if (count > 0) {
      console.log(`Dishes already exist (${count}). Skipping seeding.`);
      return;
    }

    // IMPORTANT: await insertMany and use the returned docs
    const insertedDocs = await Dish.insertMany(seed, { ordered: true });
    const ids = insertedDocs.map(d => d._id.toString());

    console.log('Sample dishes are inserted!');
    console.log('Inserted IDs:', ids);

  } catch (err) {
    console.error('Seed error:', err.message);
  } finally {
    // close gracefully
    await mongoose.connection.close().catch(() => {});
    process.exit(0);
  }
})();
