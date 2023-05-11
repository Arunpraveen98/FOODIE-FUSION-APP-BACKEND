const express = require("express");
const router = express.Router();
const Food_Items = require("../Models/Food_Items");
const { authorize } = require("../Authorize");
// --------------------------
router.get("/GetAllFoodItems", async (req, res) => {
  try {
    // -------------
    const AllFoods = await Food_Items.find({}).sort({ id: 1 });
    res.send(AllFoods);
    // -------------
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});
// --------------------------
router.post("/AddFoodItem", authorize, async (req, res) => {
  // -------------
  const FOOD_ITEMS = req.body.Foods;
  // -------------
  try {
    // -------------
    const newFoodItems = new Food_Items({
      name: FOOD_ITEMS.name,
      image: FOOD_ITEMS.image,
      varients: ["small", "medium", "large"],
      description: FOOD_ITEMS.description,
      category: FOOD_ITEMS.category,
      prices: [FOOD_ITEMS.prices],
    });
    await newFoodItems.save();
    res.send("New Food_Items Added Successfully");
    // -------------
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});
// --------------------------
router.post("/GetFoodItemsById", authorize, async (req, res) => {
  // -------------
  const pizzaid = req.body.pizzaid;
  // -------------
  try {
    // -------------
    const pizza = await Food_Items.findOne({ _id: pizzaid });
    res.send(pizza);
    // -------------
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});
// --------------------------
router.post("/EditFoodItem", authorize, async (req, res) => {
  // -------------
  const editedpizza = req.body.editedpizza;
  // -------------
  try {
    // -------------
    const pizza = await Food_Items.findOne({ _id: editedpizza._id });
    // -------------
    (pizza.name = editedpizza.name),
      (pizza.description = editedpizza.description),
      (pizza.image = editedpizza.image),
      (pizza.category = editedpizza.category),
      (pizza.prices = [editedpizza.prices]);

    await pizza.save();

    res.send("Food_Items Details Edited successfully");
    // -------------
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});
// --------------------------
router.post("/DeleteFoodItem", authorize, async (req, res) => {
  // -------------
  const Food_Id = req.body.FoodId;
  // -------------
  try {
    // -------------
    await Food_Items.findOneAndDelete({ _id: Food_Id });
    res.send("Food_Items Deleted successfully");
    // -------------
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});
// --------------------------
module.exports = router;
// --------------------------
