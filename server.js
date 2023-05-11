const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
// --------------------
app.use(express.json());
app.use(
  cors({
    origin: `${process.env.CLIENT_URL}`,
  })
);
// --------------------
const Pizza = require("./Models/Food_Items");
require("./database");
// --------------------
const FoodItemsRoute = require("./Routes/Food_Items");
const userRoute = require("./Routes/Users");
const ordersRoute = require("./Routes/Orders");
// --------------------
app.use("/api/FoodItems/", FoodItemsRoute);
app.use("/api/users/", userRoute);
app.use("/api/orders/", ordersRoute);
// --------------------
app.get("/", (req, res) => {
  res.send("server working🔥");
});
// --------------------
app.get("/getpizzas", (req, res) => {
  Pizza.find({}, (err, docs) => {
    if (err) {
      console.log(err);
    } else {
      res.send(docs);
    }
  });
});
// --------------------
const PORT = process.env.PORT || 8000;
// --------------------
app.listen(PORT, () => console.log(`Server running on - ${PORT} 🔥`));
// --------------------
