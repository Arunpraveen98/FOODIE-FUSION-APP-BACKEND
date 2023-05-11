const express = require("express");
const router = express.Router();
const Order = require("../Models/Orders");
require("dotenv").config();
const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const { authorize } = require("../Authorize");
// -------------
router.post("/placeorder", authorize, async (req, res) => {
  const { token, subtotal, currentUser, cartItems } = req.body;

  try {
    const paymentMethod = await stripe.paymentMethods.create({
      type: "card",
      card: {
        token: token.id,
      },
    });
    // Create a payment intent using the new payment method object
    const paymentIntent = await stripe.paymentIntents.create({
      amount: subtotal * 100,
      currency: "usd",
      payment_method_types: ["card"],
      payment_method: paymentMethod.id,
      confirmation_method: "automatic",
      confirm: true,
    });
    // console.log(paymentIntent);
    if (paymentIntent.status === "requires_action") {
      const neworder = new Order({
        name: currentUser.name,
        email: currentUser.email,
        userid: currentUser._id,
        orderItems: cartItems,
        orderAmount: subtotal,
        shippingAddress: {
          street: token.card.address_line1,
          city: token.card.address_city,
          country: token.card.address_country,
          pincode: token.card.address_zip,
        },
        transactionId: paymentIntent.id,
      });
      neworder.save();
      console.log(neworder);
      res.send("Order placed successfully");
    } else {
      res.send({
        error: "Payment failed",
      });
    }
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
    console.log(`Error : ${err.message}`);
  }
});

// --------------------------
router.post("/getuserorders", authorize, async (req, res) => {
  // -------------
  const { userid } = req.body;
  // -------------
  try {
    // -------------
    const orders = await Order.find({ userid: userid }).sort({ _id: -1 });
    res.send(orders);
    // -------------
  } catch (error) {
    return res.status(400).json({ message: "Something went wrong" });
  }
});
// --------------------------
router.get("/getallorders", authorize, async (req, res) => {
  try {
    // -------------
    const orders = await Order.find({});
    res.send(orders);
    // -------------
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});
// --------------------------
router.post("/deliverorder", authorize, async (req, res) => {
  // -------------
  const orderid = req.body.orderid;
  // -------------
  try {
    // -------------
    const order = await Order.findOne({ _id: orderid });
    order.isDelivered = true;
    await order.save();
    res.send("Order Delivered Successfully");
    // -------------
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});
// --------------------------
module.exports = router;
// -------------
