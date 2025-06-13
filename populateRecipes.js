const connectDB = require('./db');
const Recipes = require('./models/recipes');

const populateRecipes = [
  {
    name: "Qabli Pulao",
    ingredients: ["Rice", "Beef", "Spices", "Yogurt", "Meet tender", "Milk", "Salt"],
    preparationSteps: ["Marinate beef", "Cook beef", "Add rice", "Mix both and steam"],
    cookingTime: 90,
    origin: "Pakistan",
    serving: 7,
  },
  {
    name: "chicken Biryani",
    ingredients: ["Polao rice", "Chicken" ,"Onion", "Green chili", "Spices"],
    preparationSteps: ["Add onion and spices", "Add rice and chicken", "Mix everything and steam with water"],
    cookingTime: 45,
    origin: "Pakistan",
    serving: 5,
  },
  {
    name: "Tabuli",
    ingredients: ["Parsley", "Tomato", "Cocumber", "Lemon", "Sesame seeds"],
    preparationSteps: ["chop tomato, cocumber and parsley", "Mix Everything", "Add lemon juice at the end"],
    cookingTime: 0,
    origin: "Syrian",
    serving: 5,
  },
  {
    name: "Ramen",
    ingredients: ["Noodles", "Broth", "Egg", "beef", "Scallions"],
    preparationSteps: ["Make broth", "Boil noodles", "Assemble bowl", "Garnish it to your liking"],
    cookingTime: 45,
    origin: "Korean",
    serving: 5,
  },
  {
    name: "Lentin Soup",
    ingredients: ["Cooked Lentil", "Corriander powder", "Vegetable oil", "Salt", "Black Pepper", "Water","Parsley"],
    preparationSteps: ["Put everything togather and bring it to boil", "Add parsley for garnishing"],
    cookingTime: 30,
    origin: "Syrian",
    serving: 6,
  }
];

const connectSeed = async () => {
    await connectDB();
    try {
        const existingDishes = await Recipes.find();
        if (existingDishes.length === 0) {
          await Recipes.insertMany(populateRecipes);
          console.log('Sample dishes are inserted!');
        } else {
          console.log('Dishes already exist.');
        }
    } catch (error) {
        console.error('Error inserting dishes:a', error.message);
        process.exit(1);
    } finally {
        process.exit();
    }

};

connectSeed();